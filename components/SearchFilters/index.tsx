import { Roboto } from 'next/font/google'
import Button from '../Button'
import styles from './search-filters.module.css'

const roboto = Roboto({ weight: '400', subsets: ['latin'] })

const SearchFilters: React.FC = () => {
  return (
    <div className={styles.searchFilters}>
      <input className={`${styles.textField} ${roboto.className}`} type="text" placeholder="Nombres y Apellidos" />
      <select className={styles.selectField}>
        <option value="1">DNI</option>
        <option value="2">RUC</option>
      </select>
      <select className={styles.selectField}>
        <option value="1">Tipo de documento</option>
      </select>
      <select className={styles.selectField}>
        <option value="1">Tipo de examen</option>
      </select>
      <select className={styles.selectField}>
        <option value="1">Sede</option>
      </select>
      {/* <Button label="Buscar" /> */}
    </div>
  )
}

export default SearchFilters
