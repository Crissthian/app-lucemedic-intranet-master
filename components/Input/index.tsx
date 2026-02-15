'use client'

import { ChangeEvent, useState } from 'react'
import { Roboto } from 'next/font/google'
import styles from './input.module.css'

const roboto = Roboto({ weight: '400', subsets: ['latin'] })

interface InputProps {
  type: 'text' | 'number' | 'email' | 'password' | 'date'
  placeholder: string
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void
  value?: string
  onFocus?: (event: ChangeEvent<HTMLInputElement>) => void
  disabled?: boolean
}

const Input: React.FC<InputProps> = (props) => {
  const [inputType, setInputType] = useState<string>(props.type)

  const handleFocusDate = () => {
    if (props.type === 'date') setInputType('date')
  }

  const handleBlurDate = () => {
    if (props.type === 'date') setInputType('text')
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
