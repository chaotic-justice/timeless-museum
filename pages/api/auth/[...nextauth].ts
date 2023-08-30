import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { NextApiHandler } from 'next'
import NextAuth, { NextAuthOptions } from 'next-auth'
import GithubProvider from 'next-auth/providers/github'
import Google from 'next-auth/providers/google'

import prisma from '../../../library/prisma'

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
      data.expires_at = Number(data.refresh_token_expires_in)
      if (data.refresh_token_expires_in) {
        delete data.refresh_token_expires_in
      }
      await prisma.account.create({ data })
    },
  },
  callbacks: {
    session({ session, user }) {
      if (session.user) {
        session.user.role = user.role
      }
      return session
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
}
// #pass='KauD0=s@'
