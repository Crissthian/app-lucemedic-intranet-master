'use client'

import { ChangeEvent, FocusEvent, useEffect, useState } from 'react'
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
  const [inputType, setInputType] = useState<string>(
    props.type === 'date' && !props.value ? 'text' : props.type
  )
  const [isFocused, setIsFocused] = useState(false)

  const handleFocusDate = (e: FocusEvent<HTMLInputElement>) => {
    setIsFocused(true)
    if (props.type === 'date') setInputType('date')
    props.onFocus?.(e)
  }

  const handleBlurDate = (e: FocusEvent<HTMLInputElement>) => {
    setIsFocused(false)
    if (props.type === 'date' && !props.value) setInputType('text')
    props.onBlur?.(e)
  }

  useEffect(() => {
    if (props.type === 'date') {
      if (props.value) {
        setInputType('date')
      } else if (!isFocused) {
        setInputType('text')
      }
    }
  }, [props.value, props.type, isFocused])

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
