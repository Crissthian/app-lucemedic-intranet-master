'use client'

import React from 'react'
import { Roboto, Rubik } from 'next/font/google'
import styles from './welcome.module.css'
import Image from 'next/image'
import Button from '../Button'
import { useDispatch } from 'react-redux'
import { toggleWelcome } from '@/redux/features/global.slice'
import { ROLES_TYPES } from '@/shared/constants'
import useUserProfile from '@/hooks/useUserProfile'

const rubik500 = Rubik({ weight: '500', subsets: ['latin'] })
const roboto400 = Roboto({ weight: '400', subsets: ['latin'] })

const Welcome: React.FC = () => {
  const dispatch = useDispatch()

  const currentUser = useUserProfile()

  return (
    <div className={styles.welcome}>
      <h1 className={`${rubik500.className} ${styles.title}`}>
        ¡Hola <span>{currentUser?.firstName}!</span>
      </h1>

      {
        currentUser?.profile === ROLES_TYPES.DOCTOR || currentUser?.profile === ROLES_TYPES.RH ? (
          <p className={roboto400.className}>
            Te damos la bienvenida a nuestra nueva plataforma virtual, diseñada para
            brindarte la mejor experiencia en la gestión de la salud de tus
            colaboradores, gracias a su interfaz amigable, moderna y completa.
          </p>
        ) : (
          <p className={roboto400.className}>
            Te damos la bienvenida a nuestra nueva plataforma virtual.
          </p>
        )
      }

      <p className={roboto400.className}>En nuestra plataforma, encontrarás:</p>

      {currentUser?.profile === ROLES_TYPES.DOCTOR ? (
        <Image
          src="/features.png"
          alt={'Features - Lucemedic'}
          width={800}
          height={370}
          priority
        />
      ) : (
        ''
      )}

      {currentUser?.profile === ROLES_TYPES.RH ? (
        <Image
          src="/features-rh.png"
          alt={'Features - Lucemedic'}
          width={800}
          height={370}
          priority
        />
      ) : (
        ''
      )}

      {currentUser?.profile === ROLES_TYPES.PATIENT ? (
        <Image
          src="/features-patient.png"
          alt={'Features - Lucemedic'}
          width={800}
          height={250}
          priority
        />
      ) : (
        ''
      )}

      <Button label="Comenzar" onClick={() => dispatch(toggleWelcome())} />
    </div>
  )
}

export default Welcome
