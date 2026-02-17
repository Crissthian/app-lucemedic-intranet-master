import React from 'react'
import styles from './modal.module.css'

interface ModalProps {
  children: React.ReactNode
  title?: string
}

const Modal: React.FC<ModalProps> = (props) => {
  return (
    <div className={styles.modalBackdrop}>
      <div className={styles.modal}>
        {props.title && <h2 className={styles.modalTitle}>{props.title}</h2>}
        {props.children}
      </div>
    </div>
  )
}

export default Modal
