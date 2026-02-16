'use client'

import { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import Header from '@/components/Header'
import Navigation from '@/components/Navigation'
import styles from './app-shell.module.css'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const PUBLIC_ROUTES = ['/auth']

const isPublicRoute = (pathname: string) =>
  PUBLIC_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  )

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [hasSession, setHasSession] = useState<boolean | null>(null)

  const publicRoute = isPublicRoute(pathname)

  useEffect(() => {
    if (publicRoute) {
      setHasSession(true)
      return
    }

    const jwt = localStorage.getItem('accessToken') || ''

    if (jwt.length <= 0) {
      setHasSession(false)
      router.replace('/auth')
      return
    }

    setHasSession(true)
  }, [publicRoute, pathname, router])

  if (publicRoute) {
    return <>{children}</>
  }

  if (hasSession === null) {
    return null
  }

  if (!hasSession) {
    return null
  }

  return (
    <>
      <ToastContainer />
      <Header />
      <main className={styles.main}>
        <Navigation />
        {children}
      </main>
    </>
  )
}
