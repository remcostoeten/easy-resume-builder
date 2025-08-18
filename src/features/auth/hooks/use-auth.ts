import { useContext } from 'react'
import { AuthContext } from '@/features/auth/providers/auth-provider'

export function useAuth() {
  const context = useContext(AuthContext)
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  
  return context
}

export function useSession() {
  const { user, session, isLoading, isAuthenticated } = useAuth()
  
  return {
    user,
    session,
    isLoading,
    isAuthenticated,
    data: user && session ? { user, session } : null,
  }
}

export function useUser() {
  const { user, isLoading, isAuthenticated } = useAuth()
  
  return {
    user,
    isLoading,
    isAuthenticated,
  }
}
