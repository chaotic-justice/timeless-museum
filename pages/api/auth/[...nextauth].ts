import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { NextApiHandler } from "next"
import NextAuth, { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import adminUsers from "../../../lib/admins"
import prisma from "../../../lib/prisma"

const authHandler: NextApiHandler = (req, res) => NextAuth(req, res, options)
export default authHandler

const options: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    // GitHubProvider({
    //   clientId: process.env.GITHUB_ID,
    //   clientSecret: process.env.GITHUB_SECRET,
    // }),
    // EmailProvider({
    //   server: {
    //     host: process.env.SMTP_HOST,
    //     port: Number(process.env.SMTP_PORT),
    //     auth: {
    //       user: process.env.SMTP_USER,
    //       pass: process.env.SMTP_PASSWORD,
    //     },
    //   },
    //   from: process.env.SMTP_FROM,
    // }),
  ],
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token }) {
      token.role = adminUsers.includes(token.email!) ? "admin" : "user"
      return token
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
}
// #pass='KauD0=s@'
