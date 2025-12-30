'use client'
import { Chart } from 'react-google-charts'
import { Electrocardiogram } from '@/models/statistics'
import StatisticsGraphCard from '../StatisticsGraphCard'

interface StatisticsElectrocardiogramProps {
  data: Electrocardiogram[];
}

const StatisticsElectrocardiogram: React.FC<StatisticsElectrocardiogramProps> = (props) => {
  let data = props.data.map((item) => {
    return [item.categoria, item.cantidad]
  })

  data.unshift(['Categoria', 'Porcentaje'])

  return (
    <StatisticsGraphCard>
      {props.data.length > 0 && (
        <>
          <h2>&nbsp;</h2>
          <Chart chartType={'PieChart'} width={'100%'} height={'300px'} data={data} options={{
            pieHole: 0.4,
            is3D: false,
            colors: ['#8E3DBA', '#C695E2'],
            legend: {
              position: 'bottom',
              alignment: 'center',
              textStyle: {
                fontSize: 14,
              },
            }
          }} 
          />
        </>
      )}
    </StatisticsGraphCard>
  )
}

export default StatisticsElectrocardiogram
