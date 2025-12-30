'use-client'
import StatisticsGraphCard from '../StatisticsGraphCard'
import styles from './chart-multiple-bars.module.css'

interface ChartItem {
  value: number;
  label: string;  
}

interface ChartMultipleBarsProps {
  title: string;
  label?: string;
  data: ChartItem[];
}

const ChartMultipleBars: React.FC<ChartMultipleBarsProps> = (props) => {

  const total = props.data.reduce((acc, item) => acc + item.value, 0)

  const data = props.data.map(item => {
    const value = total !== 0 ? ((item.value / total) * 100).toFixed(1) : 0
    return {
      ...item,
      value
    }
  })

  const colors = ['#256DBB', '#566C84', '#AAD3FF', '#32A9FD']

  return (
    <StatisticsGraphCard title={props.label}>
      <h2>{props.title}</h2>
      <div className={styles.graphContainer} style={{ gridTemplateColumns: `repeat(${data.length}, 1fr)` }}>
        {
          data.map((item, index) => {
            return (
              <div key={index} className={styles.bar}>
                <div
                  className={styles.inner}
                  style={{
                    height: `${item.value}%`,
                    backgroundColor: colors[index]
                  }}
                ></div>
              </div>
            )
          })
        }
      </div>
      <div className={styles.graphFooter} style={{ gridTemplateColumns: `repeat(${data.length}, 1fr)` }}>
        {
          data.map((item, index) => {
            return (
              <p key={index}>
                {item.value}% <br />
                <span>{item.label}</span>
              </p>
            )
          })
        }
      </div>
    </StatisticsGraphCard>
  )
}

export default ChartMultipleBars