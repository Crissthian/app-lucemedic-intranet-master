'use client'
import Header from '@/components/Header'
import styles from './tracking.module.css'
import Navigation from '@/components/Navigation'
import CareTracking from '@/components/CareTracking'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function TrackingPage() {
  const router = useRouter()

  useEffect(() => {
    const jwt = localStorage.getItem('accessToken') || ''

    if (jwt.length <= 0) {
      router.push('/auth')
    }

  }, [router])

  return (
    <>
      <Header />
      <main className={styles.main}>
        <Navigation />
        <CareTracking />
      </main>
    </>
  )
}