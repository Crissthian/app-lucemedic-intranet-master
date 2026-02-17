import { useState, useEffect } from 'react'

const useAccessToken = () => {
  const [accessToken, setAccessToken] = useState<string>('')

  useEffect(() => {
    const token = localStorage.getItem('accessToken') || ''
    if (token) {
      setAccessToken(token)
    }
  }, [])

  return accessToken
}

export default useAccessToken
