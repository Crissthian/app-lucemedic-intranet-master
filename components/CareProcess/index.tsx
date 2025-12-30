'use client'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import styles from './care-process.module.css'
import { faCheckCircle, faFileMedicalAlt, faSignOutAlt } from '@fortawesome/free-solid-svg-icons'
import { AttentionMonitoring } from '@/models/attention-monitoring'

type CareProcessProps = {
  currentStep: number
  attentionMonitoring: AttentionMonitoring
}

const CareProcess: React.FC<CareProcessProps> = (props) => {
  return (
    <>
      <div className={styles.careProcessContainer}>
        <div className={styles.step}>
          <FontAwesomeIcon icon={faCheckCircle} color={'#1EE67D'} />
          <p className={styles.stepTitle}>Ingreso</p>
          <p className={styles.stepStatus}><span>Completado</span></p>
        </div>
        {
          props.currentStep === 1 && (
            <>
              <div className={styles.step}>
                <FontAwesomeIcon icon={faFileMedicalAlt} color={'#636D73'} />
                <p className={styles.stepTitle}>Evaluación</p>
                <p className={styles.stepStatusPending}><span>Pendiente</span></p>
                <div className={styles.viewMore}>Ver detalle</div>
              </div>
              <div className={styles.step}>
                <FontAwesomeIcon icon={faSignOutAlt} color={'#636D73'} />
                <p className={styles.stepTitle}>Salida</p>
                <p className={styles.stepStatusPending}><span>Pendiente</span></p>
              </div>
            </>
          )
        }
        {
          props.currentStep !== 1 && (
            <>
              <div className={styles.step}>
                <FontAwesomeIcon icon={faFileMedicalAlt} color={'#1EE67D'} />
                <p className={styles.stepTitle}>Evaluación</p>
                <p className={styles.stepStatus}><span>Completado</span></p>
                <div className={styles.viewMore}>Ver detalle</div>
              </div>
              <div className={styles.step}>
                <FontAwesomeIcon icon={faSignOutAlt} color={'#1EE67D'} />
                <p className={styles.stepTitle}>Salida</p>
                <p className={styles.stepStatus}><span>Completado</span></p>
              </div>
            </>
          )
        }
      </div>
    </>
  )
}

export default CareProcess