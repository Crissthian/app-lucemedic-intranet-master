import { useEffect, useState } from 'react'

// /api/photos exige header Bearer, que un <img src> no puede enviar:
// se descarga con fetch y se expone como blob URL.
const useAuthPhoto = (photoUrl?: string | null): string => {
  const [src, setSrc] = useState<string>('')

  useEffect(() => {
    if (!photoUrl) {
      return
    }

    const controller = new AbortController()
    let objectUrl: string | undefined

    fetch(`/api/photos/${photoUrl}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`
      },
      signal: controller.signal
    })
      .then(async (res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        objectUrl = URL.createObjectURL(await res.blob())
        setSrc(objectUrl)
      })
      .catch(() => {})

    return () => {
      controller.abort()
      if (objectUrl) URL.revokeObjectURL(objectUrl)
    }
  }, [photoUrl])

  return src
}

export default useAuthPhoto
