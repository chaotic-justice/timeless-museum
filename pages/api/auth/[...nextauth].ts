import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { NextApiHandler } from 'next'
import NextAuth, { NextAuthOptions, Session } from 'next-auth'
import Google from 'next-auth/providers/google'
import GithubProvider from 'next-auth/providers/github'

import { Role } from '@prisma/client'
import { AdapterUser } from 'next-auth/adapters'
import prisma from '../../../library/prisma'

interface CustomSession extends Session {
  user: {
    role: Role
    name?: string | null
    email?: string | null
    image?: string | null
  }
}

export interface CustomUser extends AdapterUser {
  role: Role
}

const authHandler: NextApiHandler = (req, res) => NextAuth(req, res, authOptions)
export default authHandler

export const authOptions: NextAuthOptions = {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),
  ],
  adapter: {
    ...PrismaAdapter(prisma),
    linkAccount: async ({ ...data }) => {
      // github provider returns refresh_token_expires_in which prisma adapter fails to interpret
      data.expires_at = Number(data.refresh_token_expires_in) ?? 0
      if (data.refresh_token_expires_in) {
        delete data.refresh_token_expires_in
      }
      await prisma.account.create({ data })
    },
  },
  callbacks: {
    session({ session, user }) {
      if (session.user) {
        ;(session as CustomSession).user.role = (user as CustomUser).role
      }
      return session
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
}
// #pass='KauD0=s@'
