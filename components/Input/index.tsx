'use client'

import { ChangeEvent, FocusEvent, useState } from 'react'
import { Roboto } from 'next/font/google'
import styles from './input.module.css'

const roboto = Roboto({ weight: '400', subsets: ['latin'] })

interface InputProps {
  type: 'text' | 'number' | 'email' | 'password' | 'date'
  placeholder: string
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void
  value?: string
  onFocus?: (event: FocusEvent<HTMLInputElement>) => void
  onBlur?: (event: FocusEvent<HTMLInputElement>) => void
  disabled?: boolean
}

const Input: React.FC<InputProps> = (props) => {
  const [isFocused, setIsFocused] = useState(false)

  const inputType =
    props.type === 'date'
      ? !isFocused && !props.value
        ? 'text'
        : 'date'
      : props.type

  const handleFocusDate = (e: FocusEvent<HTMLInputElement>) => {
    setIsFocused(true)
    props.onFocus?.(e)
  }

  const handleBlurDate = (e: FocusEvent<HTMLInputElement>) => {
    setIsFocused(false)
    props.onBlur?.(e)
  }

  return (
    <>
      <input
        type={inputType}
        className={`${roboto.className} ${styles.input}`}
        placeholder={props.placeholder}
        onChange={props.onChange}
        onFocus={handleFocusDate}
        onBlur={handleBlurDate}
        value={props.value ?? ''}
        disabled={props.disabled}
      />
    </>
  )
}

export default Input
