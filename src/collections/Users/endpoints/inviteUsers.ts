import crypto from 'crypto'
import { addDataAndFileToRequest, Endpoint } from 'payload'

export const inviteUsers: Endpoint = {
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
}
