import { useEffect, useState } from 'react'

export interface User {
  firstName: string
  lastName: string
  dni: string
  email: string
  profile: number
  ruc: number
  empresa: string
  photoUrl?: string
  cmp?: string
  phone?: string
  birthDate?: string
}

const useUserProfile = () => {
  const getStoredProfile = (): User | null => {
    if (typeof window === 'undefined') {
      return null
    }

    const profile = localStorage.getItem('profileLogged')
    if (!profile) {
      return null
    }

    try {
      const parsedProfile = JSON.parse(profile)
      return {
        firstName: parsedProfile.first_name || '',
        lastName: parsedProfile.last_name || '',
        dni: parsedProfile.dni || '',
        email: parsedProfile.email || '',
        profile: parsedProfile.profile ?? -1,
        ruc: parsedProfile.ruc || 0,
        empresa: parsedProfile.business_name || '',
        photoUrl: parsedProfile.photo_url || '',
        cmp: parsedProfile.cmp || '',
        phone: parsedProfile.phone || '',
        birthDate: parsedProfile.birth_date || ''
      }
    } catch (error) {
      console.error('Error parsing user profile:', error)
      return null
    }
  }

  const [userProfile, setUserProfile] = useState<User | null>(() =>
    getStoredProfile()
  )

  useEffect(() => {
    const handleStorageChange = () => {
      setUserProfile(getStoredProfile())
    }

    window.addEventListener('storage', handleStorageChange)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [])

  return userProfile
}

export default useUserProfile
