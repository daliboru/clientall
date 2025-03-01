import { addDataAndFileToRequest, Endpoint } from 'payload'

export const verifyUsersProfile: Endpoint = {
  path: '/verify',
  method: 'post',
  handler: async (req) => {
    await addDataAndFileToRequest(req)

    const { token, id } = req.data as {
      token: string
      id: string
    }

    try {
      await req.payload.verifyEmail({
        collection: 'users',
        token,
      })

      await req.payload.update({
        collection: 'users',
        id,
        data: {
          profileComplete: true,
        },
      })

      return Response.json({ message: 'Email verified', status: 200 })
    } catch (error) {
      return Response.json({ message: 'Email verification failed' })
    }
  },
}
