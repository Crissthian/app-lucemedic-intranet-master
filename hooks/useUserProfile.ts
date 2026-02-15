import { useState, useEffect } from 'react'

export interface User {
  firstName: string
  lastName: string
  dni: string
  email: string
  profile: number
  ruc: number
  empresa: string
  photoUrl?: string
}

const useUserProfile = () => {
  const [userProfile, setUserProfile] = useState<User | null>(null) // Inicializamos el perfil como null

  useEffect(() => {
    // Obtener el perfil de usuario desde localStorage al montar el componente
    const profile = localStorage.getItem('profileLogged')
    if (profile) {
      try {
        const parsedProfile = JSON.parse(profile)
        setUserProfile({
          firstName: parsedProfile.first_name || '',
          lastName: parsedProfile.last_name || '',
          dni: parsedProfile.dni || '',
          email: parsedProfile.email || '',
          profile: parsedProfile.profile ?? -1, // fallback para el perfil numérico
          ruc: parsedProfile.ruc || 0,
          empresa: parsedProfile.business_name || '',
          photoUrl: parsedProfile.photo_url || ''
        })
      } catch (error) {
        console.error('Error parsing user profile:', error)
      }
    }
  }, [])

  return userProfile
}

export default useUserProfile
