import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faHeartCircleCheck,
  faPerson,
  faRuler,
  faWeightScale
} from '@fortawesome/free-solid-svg-icons'
import { Rubik } from 'next/font/google'
import styles from './card-signal.module.css'

const rubik300 = Rubik({ weight: '300', subsets: ['latin'] })
const rubik500 = Rubik({ weight: '500', subsets: ['latin'] })

interface CardSignalProps {
  icon?: 'scale' | 'rule' | 'people' | 'heart-check'
  title?: string
  subtitle?: string
}

const CardSignal: React.FC<CardSignalProps> = ({ icon, title, subtitle }) => {
  return (
    <>
      <div className={styles.cardSignal}>
        <div>
          {icon === 'scale' && (
            <FontAwesomeIcon icon={faWeightScale} width={'30px'} />
          )}
          {icon === 'rule' && (
            <FontAwesomeIcon icon={faRuler} height={'30px'} />
          )}
          {icon === 'people' && (
            <FontAwesomeIcon icon={faPerson} height={'30px'} />
          )}
          {icon === 'heart-check' && (
            <FontAwesomeIcon icon={faHeartCircleCheck} width={'30px'} />
          )}
        </div>
        <div>
          <p className={rubik300.className}>{title}</p>
          <p className={rubik500.className}>{subtitle}</p>
        </div>
      </div>
    </>
  )
}

export default CardSignal
