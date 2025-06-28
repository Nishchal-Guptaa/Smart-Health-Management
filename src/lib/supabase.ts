import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// User (Patient) interface
export interface User {
  id: string
  email: string
  first_name: string
  last_name: string
  phone: string
  date_of_birth: string
  gender: 'male' | 'female' | 'other'
  address: string
  emergency_contact_name: string
  emergency_contact_phone: string
  blood_group?: string
  allergies?: string
  medical_history?: string
  current_medications?: string
  created_at: string
  updated_at: string
}

// Doctor interface
export interface Doctor {
  id: string
  email: string
  first_name: string
  last_name: string
  phone: string
  date_of_birth: string
  gender: 'male' | 'female' | 'other'
  address: string
  specialization: string
  license_number: string
  years_of_experience: number
  hospital_affiliation?: string
  clinic_address?: string
  consultation_fee?: number
  available_days?: string
  available_hours?: string
  created_at: string
  updated_at: string
}

// Form data interfaces for registration
export interface UserRegistrationData {
  email: string
  first_name: string
  last_name: string
  phone: string
  date_of_birth: string
  gender: 'male' | 'female' | 'other'
  address: string
  emergency_contact_name: string
  emergency_contact_phone: string
  blood_group?: string
  allergies?: string
  medical_history?: string
  current_medications?: string
}

export interface DoctorRegistrationData {
  email: string
  first_name: string
  last_name: string
  phone: string
  date_of_birth: string
  gender: 'male' | 'female' | 'other'
  address: string
  specialization: string
  license_number: string
  years_of_experience: number
  hospital_affiliation?: string
  clinic_address?: string
  consultation_fee?: number
  available_days?: string
  available_hours?: string
}

// Type for doctor-specific data
export interface DoctorData {
  specialization: string
  license_number: string
}

// Type for patient data (no extra fields)
export interface PatientData {
  // No additional fields needed
}

export interface AuthUser {
  id: string
  email: string
  user_type: 'user' | 'doctor'
  user_id?: string
  doctor_id?: string
} 