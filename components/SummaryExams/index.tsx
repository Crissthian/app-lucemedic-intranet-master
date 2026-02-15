import CardSignal from '../CardSignal'
import styles from './summary-exams.module.css'

interface SummaryExamsProps {
  peso: number
  talla: number
  imc: number
  pamm: number
  ps: number
}

const SummaryExams: React.FC<SummaryExamsProps> = (props) => {
  return (
    <div className={styles.container}>
      <CardSignal
        icon={'scale'}
        title={`${props.peso}`}
        subtitle={'Peso (Kg)'}
      />
      <CardSignal
        icon={'rule'}
        title={`${props.talla}`}
        subtitle={'Talla (Mt)'}
      />
      <CardSignal icon={'people'} title={`${props.imc}`} subtitle={'I.M.C.'} />
      <CardSignal
        icon={'heart-check'}
        title={`${props.pamm}/${props.ps}`}
        subtitle={'Presión Arterial (mmHg)'}
      />
    </div>
  )
}

export default SummaryExams
