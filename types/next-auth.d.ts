import { DefaultSession } from 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      hasPlayer?: boolean
    } & DefaultSession['user']
  }

  interface User {
    hasPlayer?: boolean
  }
}