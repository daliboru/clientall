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
      disableVerificationEmail: true,
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
      subject: 'Complete Your Profile - Tiny Portals Invitation',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #6d28d9; text-align: center;">Welcome to Tiny Portals</h1>
          <p style="color: #4b5563; font-size: 16px; line-height: 1.6;">
            Hello,<br><br>
            ${req.user.name} has invited you to join their space on TinyPortals. To get started, please complete your profile by clicking the button below.
          </p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.NEXT_PUBLIC_SERVER_URL}/complete-profile?token=${token}" 
               style="background-color: #6d28d9; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">
              Complete Your Profile
            </a>
          </div>
          <p style="color: #6b7280; font-size: 14px; text-align: center;">
            This link will expire in 1 hour. If you didn't request this invitation, you can safely ignore this email.
          </p>
        </div>
      `,
    })

    return Response.json({ success: true, existingUser: false })
  },
}
