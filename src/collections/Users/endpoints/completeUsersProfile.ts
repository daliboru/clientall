import { addDataAndFileToRequest, Endpoint } from 'payload'

export const completeUsersProfile: Endpoint = {
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
        _verified: true,
        profileComplete: true,
        resetPasswordToken: null,
        resetPasswordExpiration: null,
      },
    })

    return Response.json({ success: true })
  },
}
