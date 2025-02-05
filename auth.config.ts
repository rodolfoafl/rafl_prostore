import { NextResponse } from 'next/server'
import { NextAuthConfig } from 'next-auth'

export const authConfig = {
  providers: [],
  callbacks: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
    authorized({ request, auth }: any) {
      if (!request.cookies.get('sessionCartId')) {
        const sessionCardId = crypto.randomUUID()

        const newRequestHeaders = new Headers(request.headers)

        const response = NextResponse.next({
          request: {
            headers: newRequestHeaders,
          },
        })

        response.cookies.set('sessionCartId', sessionCardId)

        return response
      } else {
        return true
      }
    },
  },
} satisfies NextAuthConfig
