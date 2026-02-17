'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Roboto } from 'next/font/google'
import Image from 'next/image'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeadset } from '@fortawesome/free-solid-svg-icons'
import TextField from '@/components/TextField'
import { BaseApi } from '@/models/base'
import styles from './auth.module.css'

const roboto700 = Roboto({ weight: '700', subsets: ['latin'] })

export default function AuthPage() {
  const router = useRouter()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = async () => {
    const url = '/api/login'

    const data = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, password })
    })

    const result: BaseApi = await data.json()

    if (!result.status) {
      alert('Error al iniciar sesión')
    }

    if (result.status) {
      localStorage.setItem('accessToken', result.data.token.accessToken)
      localStorage.setItem('profileLogged', JSON.stringify(result.data.user))
      router.push('/')
    }
  }

  const handleUsernameChange = (value: string) => {
    setUsername(value)
  }

  const handlePasswordChange = (value: string) => {
    setPassword(value)
  }

  useEffect(() => {
    const jwt = localStorage.getItem('accessToken') || ''

    if (jwt.length > 0) {
      router.push('/')
    }
  }, [router])

  return (
    <main className={styles.main}>
      <div className={styles.leftPanel}>
        <Image
          src='/lucemedic-logo.svg'
          alt='Lucemedic'
          width={510}
          height={112}
          priority
        />
        <Image
          src='/thumb-login.png'
          alt='Lucemedic'
          width={747}
          height={447}
          priority
        />
      </div>
      <div className={styles.rightPanel}>
        <div className={styles.title}>
          <h3 className={roboto700.className}>Iniciar sesión</h3>
        </div>
        <div className={styles.formArea}>
          <div className={styles.formAuth}>
            <TextField
              type={'text'}
              label='Usuario'
              icon='user'
              value={username}
              onChange={handleUsernameChange}
            />
            <TextField
              type={'password'}
              label='Contraseña'
              icon='lock'
              value={password}
              onChange={handlePasswordChange}
            />
            <button className={roboto700.className} onClick={handleSubmit}>
              Ingresar
            </button>
          </div>
          <div className={styles.formFooter}>
            <div className={styles.formPhone}>
              <FontAwesomeIcon icon={faHeadset} width={'50px'} color='#fff' />
              <div>
                <p className={roboto700.className}>+51 980 773 060</p>
                <p className={roboto700.className}>Central de atención</p>
              </div>
            </div>
            <p className={styles.formFooterLabel}>
              Si no puedes acceder, comunícate con nosotros y nuestro equipo
              técnico te ayudará a la brevedad posible.
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
