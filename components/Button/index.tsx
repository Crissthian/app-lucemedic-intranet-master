'use client'
import { Rubik } from 'next/font/google'
import styles from './button.module.css'
import { useAppSelector } from '@/redux/store'

const rubik = Rubik({ weight: '500', subsets: ['latin'] })

interface ButtonProps {
  width?: string
  label: string
  disabled?: boolean
  onClick?: () => void
}

const Button: React.FC<ButtonProps> = (props) => {
  const isLoading = useAppSelector((state) => state.globalReducer.isLoading)

  return (
    <button
      className={`${styles.btn} ${rubik.className} ${isLoading ? styles.loading : ''}`}
      style={{ width: props.width, minWidth: props.width }}
      onClick={props.onClick}
      disabled={props.disabled || isLoading}
    >
      {isLoading ? 'Cargando...' : props.label}
    </button>
  )
}

export default Button
