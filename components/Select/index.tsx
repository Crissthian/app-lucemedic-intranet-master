import { Roboto } from 'next/font/google'
import styles from './select.module.css'

const roboto = Roboto({
  weight: ['400'],
  subsets: ['latin-ext']
})

interface OptionsInterface {
  label: string
  value: string
}

interface SelectProps {
  placeholder?: string
  options?: OptionsInterface[]
  onChange?: (event: React.ChangeEvent<HTMLSelectElement>) => void
}

const Select: React.FC<SelectProps> = (props) => {
  return (
    <>
      <select
        className={`${roboto.className} ${styles.selectField}`}
        defaultValue={props.placeholder}
        onChange={props.onChange}
      >
        <option value={props.placeholder} disabled>
          {props.placeholder}
        </option>
        {props.options?.map((option, index) => (
          <option key={index} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </>
  )
}

export default Select
