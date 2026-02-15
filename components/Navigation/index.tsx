'use client'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import {
  faCalendar,
  faChartPie,
  faFileAlt,
  faHospitalUser,
  faSliders,
  faStethoscope,
  faUsers
} from '@fortawesome/free-solid-svg-icons'
import { Roboto } from 'next/font/google'
import styles from './navigation.module.css'
import { ROLES_TYPES } from '@/shared/constants'
import useUserProfile from '@/hooks/useUserProfile'

const roboto400 = Roboto({ weight: '400', subsets: ['latin'] })

const Navigation: React.FC = () => {
  const pathname = usePathname()

  const currentUser = useUserProfile()

  return (
    <ul className={styles.navigation}>
      {currentUser?.profile === ROLES_TYPES.DOCTOR && (
        <>
          <li className={`${pathname === '/' ? styles.active : ''}`}>
            <Link href='/'>
              <FontAwesomeIcon icon={faStethoscope} width={'28px'} />
              <p className={roboto400.className}>
                Exámenes <br />
                Médicos
              </p>
            </Link>
          </li>
          <li
            className={`${pathname.includes('/statistics') ? styles.active : ''}`}
          >
            <Link href='/statistics'>
              <FontAwesomeIcon icon={faChartPie} width={'28px'} />
              <p className={roboto400.className}>
                Data <br />
                Estadística
              </p>
            </Link>
          </li>
          <li
            className={`${
              pathname.includes('/epidemiological-report') ? styles.active : ''
            }`}
          >
            <Link href='/epidemiological-report'>
              <FontAwesomeIcon icon={faFileAlt} height={'28px'} />
              <p className={roboto400.className}>
                Informe <br />
                Epidemiológico
              </p>
            </Link>
          </li>
          <li
            className={`${pathname.includes('/tracking') ? styles.active : ''}`}
          >
            <Link href='/tracking'>
              <FontAwesomeIcon icon={faUsers} width={'28px'} />
              <p className={roboto400.className}>
                Seguimiento <br />
                de atención
              </p>
            </Link>
          </li>
          <li
            className={`${pathname.includes('/appointments') ? styles.active : ''}`}
          >
            <Link href='/appointments'>
              <FontAwesomeIcon icon={faCalendar} height={'28px'} />
              <p className={roboto400.className}>
                Programador <br />
                de citas
              </p>
            </Link>
          </li>
        </>
      )}

      {currentUser?.profile === ROLES_TYPES.RH && (
        <>
          <li className={`${pathname === '/' ? styles.active : ''}`}>
            <Link href='/'>
              <FontAwesomeIcon icon={faStethoscope} width={'28px'} />
              <p className={roboto400.className}>
                Exámenes <br />
                Médicos
              </p>
            </Link>
          </li>
          <li
            className={`${pathname.includes('/tracking') ? styles.active : ''}`}
          >
            <Link href='/tracking'>
              <FontAwesomeIcon icon={faUsers} width={'28px'} />
              <p className={roboto400.className}>
                Seguimiento <br />
                de atención
              </p>
            </Link>
          </li>
          <li
            className={`${pathname.includes('/appointments') ? styles.active : ''}`}
          >
            <Link href='/appointments'>
              <FontAwesomeIcon icon={faCalendar} height={'28px'} />
              <p className={roboto400.className}>
                Programador <br />
                de citas
              </p>
            </Link>
          </li>
        </>
      )}

      {currentUser?.profile === ROLES_TYPES.PATIENT && (
        <li className={`${pathname === '/' ? styles.active : ''}`}>
          <Link href='/'>
            <FontAwesomeIcon icon={faHospitalUser} width={'28px'} />
            <p className={roboto400.className}>
              Mis <br />
              Resultados
            </p>
          </Link>
        </li>
      )}

      <li className={`${pathname.includes('/settings') ? styles.active : ''}`}>
        <Link href='/settings'>
          <FontAwesomeIcon icon={faSliders} width={'20px'} />
          <p className={roboto400.className}>Ajustes</p>
        </Link>
      </li>
    </ul>
  )
}

export default Navigation
