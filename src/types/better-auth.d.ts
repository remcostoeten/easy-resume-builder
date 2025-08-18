import 'better-auth'
import 'better-auth/client'

// Augment the better-auth module types
declare module 'better-auth' {
  interface User {
    id: string
    email: string
    name: string
    emailVerified: boolean
    image: string | null
    role: 'admin' | 'user'
    twoFactorEnabled: boolean | null
    createdAt: Date
    updatedAt: Date
  }

  interface Session {
    user: User
    session: {
      id: string
      expiresAt: Date
      token: string
      createdAt: Date
      updatedAt: Date
      ipAddress: string | null
      userAgent: string | null
      userId: string
    }
  }
}

// Augment the better-auth/client module types
declare module 'better-auth/client' {
  interface User {
    id: string
    email: string
    name: string
    emailVerified: boolean
    image: string | null
    role: 'admin' | 'user'
    twoFactorEnabled: boolean | null
    createdAt: Date
    updatedAt: Date
  }

  interface Session {
    user: User
    session: {
      id: string
      expiresAt: Date
      token: string
      createdAt: Date
      updatedAt: Date
      ipAddress: string | null
      userAgent: string | null
      userId: string
    }
  }
}

// Type for the actual session object returned by getSession
export type TAuthSession = {
  user: {
    id: string
    email: string
    name: string
    emailVerified: boolean
    image: string | null
    role: 'admin' | 'user'
    twoFactorEnabled: boolean | null
    createdAt: Date
    updatedAt: Date
  }
  session: {
    id: string
    expiresAt: Date
    token: string
    createdAt: Date
    updatedAt: Date
    ipAddress: string | null
    userAgent: string | null
    userId: string
  }
}
