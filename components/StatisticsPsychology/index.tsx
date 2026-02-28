'use client'
import { Chart } from 'react-google-charts'
import { Psychology } from '@/models/statistics'
import StatisticsGraphCard from '../StatisticsGraphCard'

interface StatisticsPsychologyProps {
  data: Psychology[]
}

const StatisticsPsychology: React.FC<StatisticsPsychologyProps> = (props) => {
  const data = props.data.map((item) => {
    return [item.categoria, item.cantidad]
  })

  data.unshift(['Categoria', 'Porcentaje'])

  return (
    <StatisticsGraphCard>
      {props.data.length > 0 && (
        <>
          <h2>&nbsp;</h2>
          <Chart
            chartType={'PieChart'}
            width={'100%'}
            height={'300px'}
            data={data}
            options={{
              pieHole: 0.4,
              is3D: false,
              colors: ['#3A7BC1', '#8DC4FF'],
              legend: {
                position: 'bottom',
                alignment: 'center',
                textStyle: {
                  fontSize: 14
                }
              }
            }}
          />
        </>
      )}
    </StatisticsGraphCard>
  )
}

export default StatisticsPsychology
