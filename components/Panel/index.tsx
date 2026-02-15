'use client'

import React from 'react'
import Image from 'next/image'
import { useAppSelector } from '@/redux/store'
import styles from './panel.module.css'

interface PanelProps {
  children: React.ReactNode
}

const Panel: React.FC<PanelProps> = (props) => {
  const isLoading = useAppSelector((state) => state.globalReducer.isLoading)

  return (
    <div className={styles.panelWrapper}>
      <div className={styles.panel}>
        {isLoading && (
          <div className={styles.loaderContainer}>
            <Image
              src='/loader.svg'
              alt='Loading...'
              width={100}
              height={100}
            />
            <p>Cargando...</p>
          </div>
        )}
        {!isLoading && props.children}
        {/* {props.children} */}
      </div>
    </div>
  )
}

export default Panel
