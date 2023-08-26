import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { NextApiHandler } from 'next'
import NextAuth, { NextAuthOptions, Session } from 'next-auth'
import Google from 'next-auth/providers/google'

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

const authHandler: NextApiHandler = (req, res) => NextAuth(req, res, options)
export default authHandler

const options: NextAuthOptions = {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  adapter: PrismaAdapter(prisma),
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
