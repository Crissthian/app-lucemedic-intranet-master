'use client'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { usePathname } from 'next/navigation'
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
            <a href='/'>
              <FontAwesomeIcon icon={faStethoscope} width={'28px'} />
              <p className={roboto400.className}>
                Exámenes <br />
                Médicos
              </p>
            </a>
          </li>
          <li
            className={`${pathname.includes('/statistics') ? styles.active : ''}`}
          >
            <a href='/statistics'>
              <FontAwesomeIcon icon={faChartPie} width={'28px'} />
              <p className={roboto400.className}>
                Data <br />
                Estadística
              </p>
            </a>
          </li>
          <li
            className={`${
              pathname.includes('/epidemiological-report') ? styles.active : ''
            }`}
          >
            <a href='/epidemiological-report'>
              <FontAwesomeIcon icon={faFileAlt} height={'28px'} />
              <p className={roboto400.className}>
                Informe <br />
                Epidemiológico
              </p>
            </a>
          </li>
          <li
            className={`${pathname.includes('/tracking') ? styles.active : ''}`}
          >
            <a href='/tracking'>
              <FontAwesomeIcon icon={faUsers} width={'28px'} />
              <p className={roboto400.className}>
                Seguimiento <br />
                de atención
              </p>
            </a>
          </li>
          <li
            className={`${pathname.includes('/appointments') ? styles.active : ''}`}
          >
            <a href='/appointments'>
              <FontAwesomeIcon icon={faCalendar} height={'28px'} />
              <p className={roboto400.className}>
                Programador <br />
                de citas
              </p>
            </a>
          </li>
        </>
      )}

      {currentUser?.profile === ROLES_TYPES.RH && (
        <>
          <li className={`${pathname === '/' ? styles.active : ''}`}>
            <a href='/'>
              <FontAwesomeIcon icon={faStethoscope} width={'28px'} />
              <p className={roboto400.className}>
                Exámenes <br />
                Médicos
              </p>
            </a>
          </li>
          <li
            className={`${pathname.includes('/tracking') ? styles.active : ''}`}
          >
            <a href='/tracking'>
              <FontAwesomeIcon icon={faUsers} width={'28px'} />
              <p className={roboto400.className}>
                Seguimiento <br />
                de atención
              </p>
            </a>
          </li>
          <li
            className={`${pathname.includes('/appointments') ? styles.active : ''}`}
          >
            <a href='/appointments'>
              <FontAwesomeIcon icon={faCalendar} height={'28px'} />
              <p className={roboto400.className}>
                Programador <br />
                de citas
              </p>
            </a>
          </li>
        </>
      )}

      {currentUser?.profile === ROLES_TYPES.PATIENT && (
        <li className={`${pathname === '/' ? styles.active : ''}`}>
          <a href='/'>
            <FontAwesomeIcon icon={faHospitalUser} width={'28px'} />
            <p className={roboto400.className}>
              Mis <br />
              Resultados
            </p>
          </a>
        </li>
      )}

      <li className={`${pathname.includes('/settings') ? styles.active : ''}`}>
        <a href='/settings'>
          <FontAwesomeIcon icon={faSliders} width={'20px'} />
          <p className={roboto400.className}>Ajustes</p>
        </a>
      </li>
    </ul>
  )
}

export default Navigation
