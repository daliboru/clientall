import crypto from 'crypto'
import {
  APIError,
  Collection,
  CollectionConfig,
  addDataAndFileToRequest,
  generatePayloadCookie,
  headersWithCors,
} from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
  },
  auth: true,
  fields: [
    // Email added by default
    {
      name: 'name',
      label: 'Name',
      type: 'text',
      required: true,
      defaultValue: '',
    },

    {
      name: 'role',
      label: 'Role',
      type: 'select',
      required: true,
      options: [
        {
          label: 'Client',
          value: 'client',
        },
        {
          label: 'Admin',
          value: 'admin',
        },
      ],
      admin: {
        position: 'sidebar',
      },
      access: {
        create: ({ req: { user } }) => user?.role === 'admin',
        update: ({ req: { user } }) => user?.role === 'admin',
      },
    },
    {
      name: 'profileComplete',
      label: 'Profile Complete',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'avatar',
      label: 'Avatar',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'relatedSpaces',
      type: 'join',
      collection: 'spaces',
      on: 'members',
      maxDepth: 2,
      hasMany: true,
    },
  ],
  access: {
    read: async ({ req }) => {
      if (!req.user) {
        return false
      }

      if (req.user.role === 'admin') {
        return true
      }

      const memberIds = req.user.relatedSpaces?.docs
        ?.flatMap((value) => {
          if (typeof value === 'object' && 'members' in value) {
            return value.members
          }
          return []
        })
        ?.map((value) => {
          if (typeof value === 'object' && 'id' in value) {
            return value.id
          }
          return value
        })

      if (!memberIds?.length) {
        return {
          id: {
            equals: req.user.id,
          },
        }
      }

      return {
        id: {
          in: memberIds,
        },
      }
    },
    create: async ({ req }) => {
      if (!req.user) {
        return false
      }

      if (req.user.role.includes('admin')) {
        return true
      }

      return false
    },
    update: async ({ req }) => {
      if (!req.user) {
        return false
      }

      if (req.user.role.includes('admin')) {
        return true
      }

      return {
        id: {
          equals: req.user.id,
        },
      }
    },
    delete: async ({ req }) => {
      if (!req.user) {
        return false
      }

      if (req.user.role.includes('admin')) {
        return true
      }

      return {
        id: {
          equals: req.user.id,
        },
      }
    },
  },
  hooks: {
    beforeLogin: [
      ({ user }) => {
        if (!user.profileComplete) {
          throw new Error('Complete your profile to login')
        }
        return user
      },
    ],
  },
  endpoints: [
    {
      path: '/complete-profile',
      method: 'post',
      handler: async (req) => {
        await addDataAndFileToRequest(req)
        if (req.user) {
          const cookies = req.headers.get('cookie')
          if (cookies?.includes('payload-token')) {
            const cookieHeader = cookies
              .split(';')
              .find((cookie) => cookie.trim().startsWith('payload-token='))
            if (cookieHeader) {
              const newCookies = cookies
                .split(';')
                .filter((cookie) => !cookie.trim().startsWith('payload-token='))
                .join(';')
              req.headers.set('cookie', newCookies)
            }
          }
        }

        const { token, password, name } = req.data as {
          token: string
          password: string
          name: string
        }

        const { docs } = await req.payload.find({
          collection: 'users',
          where: {
            resetPasswordToken: { equals: token },
            resetPasswordExpiration: { greater_than: new Date().toISOString() },
          },
        })

        if (!docs.length) {
          return Response.json({ error: 'Invalid token' }, { status: 400 })
        }

        await req.payload.update({
          collection: 'users',
          id: docs[0].id,
          data: {
            password,
            name,
            profileComplete: true,
            resetPasswordToken: null,
            resetPasswordExpiration: null,
          },
        })

        return Response.json({ success: true })
      },
    },
    {
      path: '/invite-user',
      method: 'post',
      handler: async (req) => {
        await addDataAndFileToRequest(req)

        if (!req.user) {
          return Response.json({ error: 'Forbidden' }, { status: 403 })
        }

        const { email, spaceId } = req.data as {
          email: string
          spaceId: number
        }

        const { totalDocs, docs } = await req.payload.find({
          collection: 'users',
          where: { email: { equals: email } },
        })

        const space = await req.payload.findByID({
          collection: 'spaces',
          id: spaceId,
        })

        if (totalDocs > 0) {
          const existingMembers = space.members || []
          const newMemberId = docs[0].id
          await req.payload.update({
            collection: 'spaces',
            id: spaceId,
            data: {
              members: [...existingMembers, newMemberId],
            },
          })

          return Response.json({ success: true, existingUser: true })
        }

        const tempPassword = crypto.randomBytes(16).toString('hex')
        const user = await req.payload.create({
          collection: 'users',
          data: {
            email,
            role: 'client',
            password: tempPassword,
            name: 'Invited User',
          },
        })

        const token = crypto.randomBytes(20).toString('hex')
        const expiration = new Date(Date.now() + 3600000).toISOString() // 1 hour

        await req.payload.update({
          collection: 'users',
          id: user.id,
          data: {
            resetPasswordToken: token,
            resetPasswordExpiration: expiration,
          },
        })

        await req.payload.update({
          collection: 'spaces',
          id: spaceId,
          data: {
            members: [...space.members, user.id],
          },
        })

        await req.payload.sendEmail({
          to: email,
          subject: 'Complete Your Profile',
          html: `<a href="${process.env.NEXT_PUBLIC_SERVER_URL}/complete-profile?token=${token}">Complete Profile</a>`,
        })

        return Response.json({ success: true, existingUser: false })
      },
    },
    {
      path: '/external-login',
      method: 'post',
      handler: async (req) => {
        await addDataAndFileToRequest(req)

        const { email, password } = req.data as {
          email: string
          password: string
        }

        if (!email || !password) {
          throw new APIError('Email and Password are required for login.', 400, null, true)
        }

        const foundUser = await req.payload.find({
          collection: 'users',
          where: { email: { equals: email } },
        })

        if (foundUser.totalDocs > 0) {
          try {
            const loginAttempt = await req.payload.login({
              collection: 'users',
              data: {
                email: foundUser.docs[0].email,
                password,
              },
              req,
            })

            if (loginAttempt?.token) {
              const collection: Collection = (
                req.payload.collections as { [key: string]: Collection }
              )['users']
              const cookie = generatePayloadCookie({
                collectionAuthConfig: collection.config.auth,
                cookiePrefix: req.payload.config.cookiePrefix,
                token: loginAttempt.token,
              })

              return Response.json(loginAttempt, {
                headers: headersWithCors({
                  headers: new Headers({
                    'Set-Cookie': cookie,
                  }),
                  req,
                }),
                status: 200,
              })
            }

            throw new APIError(
              'Unable to login with the provided email and password.',
              400,
              null,
              true,
            )
          } catch (e) {
            throw new APIError(
              'Unable to login with the provided email and password.',
              400,
              null,
              true,
            )
          }
        }

        throw new APIError('Unable to login with the provided email and password.', 400, null, true)
      },
    },
  ],
}
