import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { userService } from '@/lib/userService';
import type { User, Doctor } from '@/lib/supabase';

// Type guard to check if data is a User (has emergency_contact_name)
function isUser(data: User | Doctor): data is User {
  return 'emergency_contact_name' in data;
}

// Type guard to check if data is a Doctor (has specialization)
function isDoctor(data: User | Doctor): data is Doctor {
  return 'specialization' in data;
}

export const useUserData = () => {
  const { user } = useAuth();
  const [userData, setUserData] = useState<User | Doctor | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userType, setUserType] = useState<'user' | 'doctor' | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      console.log("=== useUserData Debug ===");
      console.log("User from useAuth:", user);
      console.log("User ID from useAuth:", user?.id);
      console.log("User Email from useAuth:", user?.email);
      
      if (!user?.email) {
        console.log("No user email found, setting loading to false");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        console.log("Fetching user data for email:", user.email);
        
        // Try to fetch as a regular user first using email (more reliable)
        const userResult = await userService.getUserByEmail(user.email);
        console.log("User result:", userResult);
        
        if (userResult && isUser(userResult)) {
          console.log("Found user data:", userResult);
          setUserData(userResult);
          setUserType('user');
        } else {
          console.log("User not found, trying doctor...");
          // If not found as user, try as doctor
          const doctorResult = await userService.getDoctorByEmail(user.email);
          console.log("Doctor result:", doctorResult);
          if (doctorResult && isDoctor(doctorResult)) {
            console.log("Found doctor data:", doctorResult);
            setUserData(doctorResult);
            setUserType('doctor');
          } else {
            console.log("No user or doctor found for email:", user.email);
          }
        }
      } catch (err) {
        console.error("Error in useUserData:", err);
        setError(err instanceof Error ? err.message : 'Failed to fetch user data');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user?.email]);

  const refreshUserData = async () => {
    if (!user?.email) return;
    
    try {
      setLoading(true);
      setError(null);

      const userResult = await userService.getUserByEmail(user.email);
      
      if (userResult && isUser(userResult)) {
        setUserData(userResult);
        setUserType('user');
      } else {
        const doctorResult = await userService.getDoctorByEmail(user.email);
        if (doctorResult && isDoctor(doctorResult)) {
          setUserData(doctorResult);
          setUserType('doctor');
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to refresh user data');
    } finally {
      setLoading(false);
    }
  };

  return {
    userData,
    userType,
    loading,
    error,
    refreshUserData,
    userId: userData?.id || user?.id || null
  };
}; 