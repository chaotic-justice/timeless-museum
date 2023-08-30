import { Role } from '@prisma/client'
import { DefaultSession, DefaultUser } from 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      role: Role
    } & DefaultSession
  }

  interface User extends DefaultUser {
    role: Role
  }
}
