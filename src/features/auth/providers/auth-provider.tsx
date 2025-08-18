'use client'

import { createContext, useCallback, useEffect, useRef, useState } from 'react'
import { authClient } from '@/features/auth/client/auth-client'

type TUser = {
  id: string
  name?: string
  email: string
  emailVerified: boolean
  role?: string
  image?: string | null
}

type TSession = {
  id: string
  expiresAt: Date
  token: string
}

type TAuthState = {
  user: TUser | null
  session: TSession | null
  isLoading: boolean
  isAuthenticated: boolean
}

type TAuthContextType = TAuthState & {
  signOut: () => Promise<void>
  refreshSession: () => Promise<void>
  updateUser: (user: Partial<TUser>) => void
}

export const AuthContext = createContext<TAuthContextType | null>(null)

type TAuthProviderProps = {
  children: React.ReactNode
  initialSession?: any
}

export function AuthProvider({ children, initialSession }: TAuthProviderProps) {
  const [authState, setAuthState] = useState<TAuthState>(() => {
    if (initialSession?.user && initialSession?.session) {
      return {
        user: initialSession.user,
        session: initialSession.session,
        isLoading: false,
        isAuthenticated: true,
      }
    }
    
    return {
      user: null,
      session: null,
      isLoading: true,
      isAuthenticated: false,
    }
  })

  const refreshTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined)
  const isRefreshingRef = useRef(false)

  const refreshSession = useCallback(async () => {
    if (isRefreshingRef.current) {
      return
    }
    
    isRefreshingRef.current = true
    
    try {
      const { data, error } = await authClient.getSession()
      
      if (error || !data?.session || !data?.user) {
        setAuthState({
          user: null,
          session: null,
          isLoading: false,
          isAuthenticated: false,
        })
        return
      }

      setAuthState({
        user: data.user,
        session: data.session,
        isLoading: false,
        isAuthenticated: true,
      })

      // Schedule next refresh based on session expiration
      if (data.session?.expiresAt) {
        const expiresAt = new Date(data.session.expiresAt).getTime()
        const now = Date.now()
        const timeUntilExpiry = expiresAt - now
        
        // Refresh 5 minutes before expiry or in 30 minutes, whichever is sooner
        const refreshIn = Math.min(timeUntilExpiry - 5 * 60 * 1000, 30 * 60 * 1000)
        
        if (refreshIn > 0) {
          if (refreshTimeoutRef.current) {
            clearTimeout(refreshTimeoutRef.current)
          }
          refreshTimeoutRef.current = setTimeout(refreshSession, refreshIn)
        }
      }
    } catch (error) {
      console.error('Session refresh failed:', error)
      setAuthState({
        user: null,
        session: null,
        isLoading: false,
        isAuthenticated: false,
      })
    } finally {
      isRefreshingRef.current = false
    }
  }, [])

  const signOut = useCallback(async () => {
    try {
      await authClient.signOut()
    } catch (error) {
      console.error('Sign out error:', error)
    } finally {
      // Clear refresh timeout
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current)
      }
      
      // Update state immediately
      setAuthState({
        user: null,
        session: null,
        isLoading: false,
        isAuthenticated: false,
      })
      
      // Trigger custom event to notify other components
      window.dispatchEvent(new CustomEvent('auth:changed'))
    }
  }, [])

  const updateUser = useCallback((userUpdate: Partial<TUser>) => {
    setAuthState((prev) => ({
      ...prev,
      user: prev.user ? { ...prev.user, ...userUpdate } : null,
    }))
  }, [])

  // Initialize session on mount if not provided
  useEffect(() => {
    if (!initialSession) {
      refreshSession()
    }
  }, [initialSession, refreshSession])

  // Listen for auth events from better-auth client
  useEffect(() => {
    const handleAuthChange = () => {
      refreshSession()
    }

    // Listen to storage events for cross-tab synchronization
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key?.includes('better-auth') || e.key?.includes('session')) {
        refreshSession()
      }
    }

    // Listen for custom auth events
    const handleCustomAuthEvent = () => {
      refreshSession()
    }

    // Set up event listeners
    window.addEventListener('focus', handleAuthChange)
    window.addEventListener('storage', handleStorageChange)
    window.addEventListener('auth:changed', handleCustomAuthEvent)
    
    // Also refresh session periodically when tab is visible
    const intervalId = setInterval(() => {
      if (document.visibilityState === 'visible') {
        refreshSession()
      }
    }, 5 * 60 * 1000) // Every 5 minutes

    return () => {
      window.removeEventListener('focus', handleAuthChange)
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('auth:changed', handleCustomAuthEvent)
      clearInterval(intervalId)
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current)
      }
    }
  }, [refreshSession])

  const contextValue: TAuthContextType = {
    ...authState,
    signOut,
    refreshSession,
    updateUser,
  }

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  )
}
