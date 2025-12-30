'use client'
import { Audiometry } from '@/models/statistics'
import StatisticsGraphCard from '../StatisticsGraphCard'
import styles from './statistics-audiometry.module.css'
import { Roboto } from 'next/font/google'

const roboto400 = Roboto({ weight: '400', subsets: ['latin'] })
const colors = ['#18BA66', '#58D8CA', '#32A9FD', '#4E7EF2', '#A161C6', '#7626A5', '#FD8A79']

interface StatisticsAudiometryProps {
  data: Audiometry[];
}

const StatisticsAudiometry: React.FC<StatisticsAudiometryProps> = (props) => {
  return (
    <StatisticsGraphCard title={'Audiometría'}>
      {props.data.length > 0 && (
        <>
          <div className={styles.container}>
            {
              props.data.map((item, index) => (
                <div key={index} className={styles.row}>
                  <div className={styles.bar}>
                    <div className={styles.barValue} style={{ width: `${item.cantidad}%`, background: colors[index]}}></div>
                  </div>
                  <div className={styles.caption}>
                    <p><strong>{item.cantidad}%</strong></p>
                    <p><span className={roboto400.className}>{item.categoria}</span></p>
                  </div>
                </div>
              ))
            }
          </div>
        </>
      )}
    </StatisticsGraphCard>
  )
}

export default StatisticsAudiometry
