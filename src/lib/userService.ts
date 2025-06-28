import { supabase } from './supabase'
import type { User, Doctor, UserRegistrationData, DoctorRegistrationData } from './supabase'

export const userService = {
  // Get all users (patients)
  async getAllUsers(): Promise<User[]> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      throw new Error(`Failed to fetch users: ${error.message}`)
    }

    return data || []
  },

  // Get all doctors
  async getAllDoctors(): Promise<Doctor[]> {
    const { data, error } = await supabase
      .from('doctors')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      throw new Error(`Failed to fetch doctors: ${error.message}`)
    }

    return data || []
  },

  // Get user by ID
  async getUserById(id: string): Promise<User | null> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      throw new Error(`Failed to fetch user: ${error.message}`)
    }

    return data
  },

  // Get doctor by ID
  async getDoctorById(id: string): Promise<Doctor | null> {
    const { data, error } = await supabase
      .from('doctors')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      throw new Error(`Failed to fetch doctor: ${error.message}`)
    }

    return data
  },

  // Create new user (patient)
  async createUser(userData: UserRegistrationData): Promise<User> {
    const { data, error } = await supabase
      .from('users')
      .insert(userData)
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to create user: ${error.message}`)
    }

    return data
  },

  // Create new doctor
  async createDoctor(doctorData: DoctorRegistrationData): Promise<Doctor> {
    const { data, error } = await supabase
      .from('doctors')
      .insert(doctorData)
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to create doctor: ${error.message}`)
    }

    return data
  },

  // Update user profile
  async updateUser(id: string, updates: Partial<User>): Promise<User> {
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to update user: ${error.message}`)
    }

    return data
  },

  // Update doctor profile
  async updateDoctor(id: string, updates: Partial<Doctor>): Promise<Doctor> {
    const { data, error } = await supabase
      .from('doctors')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to update doctor: ${error.message}`)
    }

    return data
  },

  // Search users by name or email
  async searchUsers(query: string): Promise<User[]> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .or(`first_name.ilike.%${query}%,last_name.ilike.%${query}%,email.ilike.%${query}%`)
      .order('created_at', { ascending: false })

    if (error) {
      throw new Error(`Failed to search users: ${error.message}`)
    }

    return data || []
  },

  // Search doctors by name, email, or specialization
  async searchDoctors(query: string): Promise<Doctor[]> {
    const { data, error } = await supabase
      .from('doctors')
      .select('*')
      .or(`first_name.ilike.%${query}%,last_name.ilike.%${query}%,email.ilike.%${query}%,specialization.ilike.%${query}%`)
      .order('created_at', { ascending: false })

    if (error) {
      throw new Error(`Failed to search doctors: ${error.message}`)
    }

    return data || []
  },

  // Get doctors by specialization
  async getDoctorsBySpecialization(specialization: string): Promise<Doctor[]> {
    const { data, error } = await supabase
      .from('doctors')
      .select('*')
      .ilike('specialization', `%${specialization}%`)
      .order('created_at', { ascending: false })

    if (error) {
      throw new Error(`Failed to fetch doctors by specialization: ${error.message}`)
    }

    return data || []
  },

  // Get doctors by experience level
  async getDoctorsByExperience(minYears: number): Promise<Doctor[]> {
    const { data, error } = await supabase
      .from('doctors')
      .select('*')
      .gte('years_of_experience', minYears)
      .order('years_of_experience', { ascending: false })

    if (error) {
      throw new Error(`Failed to fetch doctors by experience: ${error.message}`)
    }

    return data || []
  },

  // Get doctors by consultation fee range
  async getDoctorsByFeeRange(minFee: number, maxFee: number): Promise<Doctor[]> {
    const { data, error } = await supabase
      .from('doctors')
      .select('*')
      .gte('consultation_fee', minFee)
      .lte('consultation_fee', maxFee)
      .order('consultation_fee', { ascending: true })

    if (error) {
      throw new Error(`Failed to fetch doctors by fee range: ${error.message}`)
    }

    return data || []
  },

  // Get user by email
  async getUserByEmail(email: string): Promise<User | null> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single()

    if (error) {
      return null
    }

    return data
  },

  // Get doctor by email
  async getDoctorByEmail(email: string): Promise<Doctor | null> {
    const { data, error } = await supabase
      .from('doctors')
      .select('*')
      .eq('email', email)
      .single()

    if (error) {
      return null
    }

    return data
  },

  // Delete user
  async deleteUser(id: string): Promise<void> {
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', id)

    if (error) {
      throw new Error(`Failed to delete user: ${error.message}`)
    }
  },

  // Delete doctor
  async deleteDoctor(id: string): Promise<void> {
    const { error } = await supabase
      .from('doctors')
      .delete()
      .eq('id', id)

    if (error) {
      throw new Error(`Failed to delete doctor: ${error.message}`)
    }
  }
} 