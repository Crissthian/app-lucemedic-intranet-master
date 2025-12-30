'use client'
import React from 'react'
import { Rubik } from 'next/font/google'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAssistiveListeningSystems, faBrain, faEye, faFlask, faHardHat, faHeartbeat, faLungs, faNotesMedical, faTooth, faUsers, faWeight, faXRay } from '@fortawesome/free-solid-svg-icons'
import styles from './panel-icon.module.css'

const rubik = Rubik({ weight: '500', subsets: ['latin'] })

interface PanelProps {
  children: React.ReactNode;
  title?: string;
  icon?: 'xray' | 'audio' | 'heart' | 'weight' | 'laboratory' | 'users' | 'notes-medical' | 'audiometry' | 'spirometry' | 'ophthalmology' | 'brain' | 'odontology' | 'hard-hat'
  container?: boolean;
}

const PanelIcon: React.FC<PanelProps> = (props) => {
  return (
    <div className={styles.panelWrapper}>
      <div className={`${styles.panel} ${!props.container ? styles.withoutPadding : null}`}>
        <div className={styles.header}>
          <div className={styles.icon}>
            {
              props.icon === 'xray' && <FontAwesomeIcon icon={faXRay} color='#fff' />
            }
            {
              props.icon === 'audio' && <FontAwesomeIcon icon={faAssistiveListeningSystems} color='#fff' />
            }
            {
              props.icon === 'heart' && <FontAwesomeIcon icon={faHeartbeat} color='#fff' />
            }
            {
              props.icon === 'weight' && <FontAwesomeIcon icon={faWeight} color='#fff' />
            }
            {
              props.icon === 'laboratory' && <FontAwesomeIcon icon={faFlask} color='#fff' />
            }
            {
              props.icon === 'users' && <FontAwesomeIcon icon={faUsers} color='#fff' />
            }
            {
              props.icon === 'notes-medical' && <FontAwesomeIcon icon={faNotesMedical} color='#fff' />
            }
            {
              props.icon === 'audiometry' && <FontAwesomeIcon icon={faAssistiveListeningSystems} color='#fff' />
            }
            {
              props.icon === 'spirometry' && <FontAwesomeIcon icon={faLungs} color='#fff' />
            }
            {
              props.icon === 'ophthalmology' && <FontAwesomeIcon icon={faEye} color='#fff' />
            }
            {
              props.icon === 'brain' && <FontAwesomeIcon icon={faBrain} color='#fff' />
            }
            {
              props.icon === 'odontology' && <FontAwesomeIcon icon={faTooth} color='#fff' />
            }
            {
              props.icon === 'hard-hat' && <FontAwesomeIcon icon={faHardHat} color='#fff' />
            }
          </div>
          <p className={rubik.className}>{ props.title }</p>
        </div>
        <div className={styles.body}>
          {props.children}
        </div>
      </div>
    </div>
  )
}

export default PanelIcon
