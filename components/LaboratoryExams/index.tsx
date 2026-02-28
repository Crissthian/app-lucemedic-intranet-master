'use client'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFireFlameSimple, faFlask } from '@fortawesome/free-solid-svg-icons'
import styles from './laboratory-exams.module.css'
import { Rubik } from 'next/font/google'
import { useAppSelector } from '@/redux/store'

const rubik300 = Rubik({ weight: '300', subsets: ['latin'] })
const rubik500 = Rubik({ weight: '500', subsets: ['latin'] })

const LaboratoryExams: React.FC = () => {
  const details = useAppSelector((state) => state.medicalExamsReducer.details)

  return (
    <>
      <div className={styles.container}>
        <div className={styles.icon}>
          <FontAwesomeIcon icon={faFlask} width={'30px'} />
        </div>
        <div className={styles.info}>
          <h2 className={rubik500.className}>Exámenes de Laboratorio</h2>
          <div className={styles.cards}>
            <div className={styles.card}>
              <div>
                <FontAwesomeIcon icon={faFireFlameSimple} width={'25px'} />
                <p className={rubik300.className}>{details.hemoglobina}</p>
              </div>
              <p className={rubik500.className}>Hemoglobina</p>
            </div>
            <div className={styles.card}>
              <div>
                <FontAwesomeIcon icon={faFireFlameSimple} width={'25px'} />
                <p className={rubik300.className}>{details.colesterol}</p>
              </div>
              <p className={rubik500.className}>Colesterol</p>
            </div>
            <div className={styles.card}>
              <div>
                <FontAwesomeIcon icon={faFireFlameSimple} width={'25px'} />
                <p className={rubik300.className}>{details.trigliceridos}</p>
              </div>
              <p className={rubik500.className}>Triglicéridos</p>
            </div>
            <div className={styles.card}>
              <div>
                <FontAwesomeIcon icon={faFireFlameSimple} width={'25px'} />
                <p className={rubik300.className}>{details.glucosa}</p>
              </div>
              <p className={rubik500.className}>Glucosa</p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default LaboratoryExams
