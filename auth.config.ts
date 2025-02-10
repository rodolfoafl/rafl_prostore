import { NextResponse } from 'next/server'
import { NextAuthConfig } from 'next-auth'

import { PROTECTED_PATHS } from '@/lib/constants'

export const authConfig = {
  providers: [],
  callbacks: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
    authorized({ request, auth }: any) {
      // Get pathname from the req URL object
      const { pathname } = request.nextUrl

      // Check if a not authenticated user is accessing a protected path
      if (!auth && PROTECTED_PATHS.some((p) => p.test(pathname))) return false

      // Check if user is authenticated and is trying to access admin path
      if (auth && !auth.user.isAdmin && pathname.includes('/admin')) {
        const url = request.nextUrl.clone()
        url.pathname = '/'
        return NextResponse.redirect(url)
      }

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
