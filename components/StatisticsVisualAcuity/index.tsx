'use client'
import { Chart } from 'react-google-charts'
import { VisualAcuity } from '@/models/statistics'
import StatisticsGraphCard from '../StatisticsGraphCard'

interface StatisticsVisualAcuityProps {
  data: VisualAcuity[]
}

const StatisticsVisualAcuity: React.FC<StatisticsVisualAcuityProps> = (
  props
) => {
  const data = props.data.map((item) => {
    return [item.categoria, item.cantidad]
  })

  data.unshift(['Categoria', 'Porcentaje'])

  return (
    <StatisticsGraphCard>
      {props.data.length > 0 && (
        <>
          <h2>Agudeza Visual</h2>
          <Chart
            chartType={'PieChart'}
            width={'600px'}
            height={'400px'}
            data={data}
            options={{
              pieHole: 0.4,
              is3D: false,
              colors: ['#D996FF', '#794099', '#CD7F32'],
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

export default StatisticsVisualAcuity
