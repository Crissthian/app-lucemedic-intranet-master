'use client'
import Header from '@/components/Header'
import styles from './epidemiological-report.module.css'
import Navigation from '@/components/Navigation'
import Panel from '@/components/Panel'
import TableEpidemiological from '@/components/TableEpidemiological'
import {useRouter} from 'next/navigation'
import {useEffect} from 'react'

export default function EpidemiologicalReport() {
  const router = useRouter()

  useEffect(() => {

    const jwt = localStorage.getItem('accessToken') || ''

    if (jwt.length <= 0) {
      router.push('/auth')
    }

  }, [router])

  return (
    <>
      <Header/>
      <main className={styles.main}>
        <Navigation/>
        <Panel>
          <div className={styles.container}>
            <p>Encuentra aquí los informes epidemiológicos realizados por nuestra área de medicina <br/> ocupacional
              para tu empresa.</p>
            <TableEpidemiological/>
          </div>
        </Panel>
      </main>
    </>
  )
}