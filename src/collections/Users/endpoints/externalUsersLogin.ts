import type { Collection, Endpoint } from 'payload'

import { addDataAndFileToRequest, APIError, generatePayloadCookie, headersWithCors } from 'payload'

export const externalUsersLogin: Endpoint = {
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
          const collection: Collection = (req.payload.collections as { [key: string]: Collection })[
            'users'
          ]
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

        throw new APIError('Unable to login with the provided email and password.', 400, null, true)
      } catch (e) {
        throw new APIError('Unable to login with the provided email and password.', 400, null, true)
      }
    }

    throw new APIError('Unable to login with the provided email and password.', 400, null, true)
  },
}
