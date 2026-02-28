'use client'
import { Chart } from 'react-google-charts'
import { ChestXRay } from '@/models/statistics'
import StatisticsGraphCard from '../StatisticsGraphCard'

interface StatisticsChestXRayProps {
  data: ChestXRay[]
}

const StatisticsChestXRay: React.FC<StatisticsChestXRayProps> = (props) => {
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
              colors: ['#872E21', '#FE7E6B'],
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

export default StatisticsChestXRay
