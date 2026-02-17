'use client'
import Image from 'next/image'
import { Roboto } from 'next/font/google'
import styles from './header.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faChevronDown,
  faChevronUp,
  faSignOut,
  faUser
} from '@fortawesome/free-solid-svg-icons'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import useUserProfile from '@/hooks/useUserProfile'

const roboto500 = Roboto({ weight: '500', subsets: ['latin'] })
const roboto400 = Roboto({ weight: '400', subsets: ['latin'] })

const Header: React.FC = () => {
  const router = useRouter()

  const currentUser = useUserProfile()
  const [showActions, setShowActions] = useState<boolean>(false)

  const getProfile = (code: number): string => {
    switch (code) {
      case 0:
        return 'Médico'
      case 1:
        return 'RRHH'
      case 3:
        return 'Paciente'
      default:
        return 'Perfil'
    }
  }

  const getFullName = (firstName: string, lastName: string): string => {
    return `${firstName} ${lastName}`
  }

  const handleActions = () => {
    setShowActions((prev) => !prev)
  }

  const handleLogout = () => {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('profileLogged')
    router.push('/auth')
  }

  return (
    <div className={styles.header}>
      <Link href='/' as={'/'}>
        <Image
          src='/lucemedic-logo.svg'
          alt='Lucemedic'
          width={300}
          height={66}
          priority
        />
      </Link>
      <div className={styles.currentUser}>
        <div className={styles.profilePicture}>
          {currentUser?.photoUrl && (
            <img
              src={`/api/photos/${currentUser.photoUrl}`}
              alt='Profile'
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                borderRadius: '10%'
              }}
            />
          )}
        </div>
        <div className={styles.personalData}>
          <h2 className={roboto500.className}>
            {getFullName(
              currentUser?.firstName || '',
              currentUser?.lastName || ''
            ) || 'Nombres y Apellidos'}
          </h2>
          <h3 className={roboto500.className}>
            {currentUser?.empresa || 'Empresa'}
          </h3>
          <p className={roboto400.className}>
            {getProfile(currentUser?.profile || 0)}
          </p>
        </div>
        <div className={styles.actions} onClick={handleActions}>
          {showActions ? (
            <FontAwesomeIcon icon={faChevronUp} color='#BBCDD9' />
          ) : (
            <FontAwesomeIcon icon={faChevronDown} color='#BBCDD9' />
          )}
        </div>
      </div>
      {showActions && (
        <div className={styles.panelActions}>
          <div
            className={roboto400.className}
            onClick={() => router.push('/settings')}
          >
            <FontAwesomeIcon icon={faUser} /> Mi cuenta
          </div>
          <div className={roboto400.className} onClick={() => handleLogout()}>
            <FontAwesomeIcon icon={faSignOut} /> Cerrar sesión
          </div>
        </div>
      )}
    </div>
  )
}

export default Header
