'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'
import Navigation from '@/components/Navigation'
import styles from './statistics.module.css'
import StatisticsPanel from '@/components/StatisticsPanel'

export default function Statistics() {
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
        <StatisticsPanel />
      </main>
    </>
  )
}
