'use client'
import { faBell } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import styles from './empty-data.module.css'
import { Rubik } from 'next/font/google'

const rubik = Rubik({ weight: '400', subsets: ['latin'] })

const EmtpyData: React.FC = () => {
  return (
    <div className={styles.container}>
      <FontAwesomeIcon icon={faBell} size="2x" color={'#1EE67D'} />
      <p className={rubik.className}>No se han encontrado <br/>resultados</p>
    </div>
  )
}

export default EmtpyData