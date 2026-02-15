'use client'
import { Chart } from 'react-google-charts'
import { BloodPressure } from '@/models/statistics'
import StatisticsGraphCard from '../StatisticsGraphCard'

interface StatisticsBloodPressureProps {
  data: BloodPressure[]
}

const StatisticsBloodPressure: React.FC<StatisticsBloodPressureProps> = (
  props
) => {
  let data = props.data.map((item) => {
    return [item.categoria, item.cantidad]
  })

  data.unshift(['Categoria', 'Porcentaje'])

  return (
    <StatisticsGraphCard>
      {props.data.length > 0 && (
        <>
          <h2>Presión arterial</h2>
          <Chart
            chartType={'PieChart'}
            width={'100%'}
            height={'400px'}
            data={data}
            options={{
              pieHole: 0.4,
              is3D: false,
              colors: ['#414D55', '#87BFFF', '#0496FF'],
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

export default StatisticsBloodPressure
