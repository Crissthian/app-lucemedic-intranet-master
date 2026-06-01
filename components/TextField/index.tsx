import { Roboto } from 'next/font/google'
import styles from './text-field.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLock, faUser } from '@fortawesome/free-solid-svg-icons'
import { ChangeEvent } from 'react'

const roboto = Roboto({ weight: '500', subsets: ['latin'] })

interface TextFieldProps {
  label: string
  type?: 'text' | 'password'
  icon?: 'user' | 'lock'
  value?: string
  onChange?: (value: string) => void
  name?: string
  autoComplete?: string
}

const TextField: React.FC<TextFieldProps> = ({
  label,
  type,
  icon,
  value,
  onChange,
  name,
  autoComplete
}) => {
  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (onChange) {
      onChange(event.target.value)
    }
  }

  return (
    <div className={styles.textField}>
      <FontAwesomeIcon
        icon={icon === 'user' ? faUser : faLock}
        width={'15px'}
      />
      <input
        type={type}
        placeholder={label}
        className={roboto.className}
        value={value || ''}
        onChange={handleInputChange}
        name={name}
        autoComplete={autoComplete}
      />
    </div>
  )
}

export default TextField
