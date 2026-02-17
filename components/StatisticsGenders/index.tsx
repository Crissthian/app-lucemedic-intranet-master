import { Genders } from '@/models/statistics'
import StatisticsGraphCard from '../StatisticsGraphCard'
import styles from './statistics-genders.module.css'

interface StatisticsGendersProps {
  data: Genders
}

const StatisticsGenders: React.FC<StatisticsGendersProps> = (props) => {
  return (
    <StatisticsGraphCard>
      {props.data.masculino && props.data.femenino && (
        <>
          <h2>Según género</h2>
          <div className={styles.graphContainer}>
            <div className={styles.bar}>
              <div
                className={styles.inner}
                style={{ height: `${parseFloat(props.data.masculino)}%` }}
              ></div>
            </div>
            <div className={styles.bar}>
              <div
                className={styles.innerGreen}
                style={{ height: `${parseFloat(props.data.femenino)}%` }}
              ></div>
            </div>
          </div>
          <div className={styles.graphFooter}>
            <p>
              {parseFloat(props.data.masculino)}% <br />
              <span>Hombres</span>
            </p>
            <p>
              {parseFloat(props.data.femenino)}% <br />
              <span>Mujeres</span>
            </p>
          </div>
        </>
      )}
    </StatisticsGraphCard>
  )
}

export default StatisticsGenders
