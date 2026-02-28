import { useEffect, useState } from 'react'

const getStoredAccessToken = () => {
  if (typeof window === 'undefined') {
    return ''
  }

  return localStorage.getItem('accessToken') || ''
}

const useAccessToken = () => {
  const [accessToken, setAccessToken] = useState<string>(() =>
    getStoredAccessToken()
  )

  useEffect(() => {
    const handleStorageChange = () => {
      setAccessToken(getStoredAccessToken())
    }

    window.addEventListener('storage', handleStorageChange)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [])

  return accessToken
}

export default useAccessToken
