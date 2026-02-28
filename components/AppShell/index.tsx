'use client'

import { useEffect, useSyncExternalStore } from 'react'
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

  const accessToken = useSyncExternalStore(
    (onStoreChange) => {
      if (typeof window === 'undefined') {
        return () => {}
      }

      window.addEventListener('storage', onStoreChange)
      return () => window.removeEventListener('storage', onStoreChange)
    },
    () => {
      if (typeof window === 'undefined') {
        return ''
      }

      return localStorage.getItem('accessToken') || ''
    },
    () => ''
  )

  const publicRoute = isPublicRoute(pathname)
  const hasSession = publicRoute || accessToken.length > 0

  useEffect(() => {
    if (!publicRoute && !hasSession) {
      router.replace('/auth')
    }
  }, [publicRoute, hasSession, router])

  if (publicRoute) {
    return <>{children}</>
  }

  if (!hasSession) {
    return null
  }

  return (
    <>
      <ToastContainer/>
      <Header />
      <main className={styles.main}>
        <Navigation />
        {children}
      </main>
    </>
  )
}
