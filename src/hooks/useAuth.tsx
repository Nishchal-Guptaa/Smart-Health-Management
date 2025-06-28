import { useState, useEffect, createContext, useContext } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import { useToast } from './use-toast'
import { userService } from '@/lib/userService'
import type { UserRegistrationData, DoctorRegistrationData } from '@/lib/supabase'

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  signUp: (email: string, password: string, userData: UserRegistrationData | DoctorRegistrationData, userType: 'user' | 'doctor') => Promise<void>
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signUp = async (email: string, password: string, userData: UserRegistrationData | DoctorRegistrationData, userType: 'user' | 'doctor') => {
    try {
      setLoading(true)
      
      // Sign up with Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      })

      if (error) throw error

      if (data.user) {
        // Insert user data into appropriate table
        if (userType === 'user') {
          await userService.createUser(userData as UserRegistrationData)
        } else {
          await userService.createDoctor(userData as DoctorRegistrationData)
        }

        toast({
          title: 'Account Created',
          description: `Welcome to MediFlow! Your ${userType} account has been created successfully.`,
        })
      }
    } catch (error: any) {
      toast({
        title: 'Registration Failed',
        description: error.message,
        variant: 'destructive',
      })
      throw error
    } finally {
      setLoading(false)
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true)
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      toast({
        title: 'Login Successful',
        description: 'Welcome back!',
      })
    } catch (error: any) {
      toast({
        title: 'Login Failed',
        description: error.message,
        variant: 'destructive',
      })
      throw error
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    try {
      setLoading(true)
      
      const { error } = await supabase.auth.signOut()
      if (error) throw error

      toast({
        title: 'Signed Out',
        description: 'You have been successfully signed out.',
      })
    } catch (error: any) {
      toast({
        title: 'Sign Out Failed',
        description: error.message,
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const resetPassword = async (email: string) => {
    try {
      setLoading(true)
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      })

      if (error) throw error

      toast({
        title: 'Reset Link Sent',
        description: 'Check your email for password reset instructions.',
      })
    } catch (error: any) {
      toast({
        title: 'Reset Failed',
        description: error.message,
        variant: 'destructive',
      })
      throw error
    } finally {
      setLoading(false)
    }
  }

  const value = {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut,
    resetPassword,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
} 