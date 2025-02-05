import { PrismaAdapter } from '@auth/prisma-adapter'
import { compareSync } from 'bcrypt-ts-edge'
import { cookies } from 'next/headers'
import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

import { authConfig } from '@/auth.config'
import { prisma } from '@/db/prisma'

export const config = {
  pages: {
    signIn: '/sign-in',
    error: '/sign-in',
  },
  session: {
    strategy: 'jwt' as const,
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      credentials: {
        email: { type: 'email' },
        password: { type: 'password' },
      },
      async authorize(credentials) {
        if (credentials == null) return null

        const user = await prisma.user.findFirst({
          where: {
            email: credentials.email as string,
          },
        })

        if (user && user.password) {
          const isMatch = await compareSync(
            credentials.password as string,
            user.password,
          )

          if (isMatch) {
            return {
              id: user.id,
              name: user.name,
              email: user.email,
              role: user.role,
            }
          }
        }

        return null
      },
    }),
  ],
  callbacks: {
    ...authConfig.callbacks,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async session({ session, user, trigger, token }: any) {
      session.user.id = token.sub
      session.user.role = token.role
      session.user.name = token.name

      if (trigger === 'update') {
        session.user.name = user.name
      }

      return session
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
    async jwt({ token, user, trigger, session }: any) {
      if (user) {
        token.id = user.id
        token.role = user.role

        if (user.name === 'NO_NAME') {
          token.name = user.email!.split('@')[0]

          await prisma.user.update({
            where: { id: user.id },
            data: { name: token.name },
          })
        }

        if (trigger === 'signIn' || trigger === 'signUp') {
          const cookiesObject = await cookies()
          const sessionCartId = cookiesObject.get('sessionCartId')?.value

          if (sessionCartId) {
            const sessionCart = await prisma.cart.findFirst({
              where: {
                sessionCartId,
              },
            })

            if (!sessionCart) return token

            if (sessionCart.userId !== user.id) {
              await prisma.cart.deleteMany({
                where: {
                  userId: user.id,
                },
              })

              await prisma.cart.update({
                where: {
                  id: sessionCart.id,
                },
                data: { userId: user.id },
              })
            }
          }
        }
      }

      return token
    },
  },
}

export const { handlers, auth, signIn, signOut } = NextAuth(config)
