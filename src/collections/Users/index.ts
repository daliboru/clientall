import { CollectionConfig } from 'payload'
import { resetPasswordEmail } from '../../lib/emails/resetPasswordEmail'
import { completeUsersProfile } from './endpoints/completeUsersProfile'
import { externalUsersLogin } from './endpoints/externalUsersLogin'
import { inviteUsers } from './endpoints/inviteUsers'
import { verifyUsersProfile } from './endpoints/verifyUsersProfile'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
  },
  auth: {
    verify: true,
    tokenExpiration: 28800, // 8 hours
    forgotPassword: {
      expiration: 28800, // 8 hours
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      generateEmailSubject: () => {
        return 'Password Reset | Tiny Portals'
      },
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      generateEmailHTML: ({ token }) => {
        const resetPasswordURL = `${process.env.NEXT_PUBLIC_SERVER_URL}/reset-password?token=${token}`
        return resetPasswordEmail(resetPasswordURL)
      },
    },
  },
  fields: [
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
    {
      name: 'calendly_url',
      label: 'Calendly URL',
      type: 'text',
      required: false,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'lastLogin',
      label: 'Last Login',
      type: 'date',
      required: false,
      admin: {
        position: 'sidebar',
      },
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

        if (!user._verified) {
          throw new Error('Verify your email to login')
        }
        return user
      },
    ],
    afterLogin: [
      async ({ req, user }) => {
        await req.payload.update({
          collection: 'users',
          id: user.id,
          data: {
            lastLogin: new Date().toISOString(),
          },
        })
        return user
      },
    ],
  },
  endpoints: [completeUsersProfile, inviteUsers, externalUsersLogin, verifyUsersProfile],
}
