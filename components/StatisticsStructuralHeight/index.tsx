'use client'
import { Chart } from 'react-google-charts'
import { StructuralHeight } from '@/models/statistics'
import StatisticsGraphCard from '../StatisticsGraphCard'

interface StatisticsStructuralHeightProps {
  data: StructuralHeight[];
}

const StatisticsStructuralHeight: React.FC<StatisticsStructuralHeightProps> = (props) => {
  let data = props.data.map((item) => {
    return [item.categoria, item.cantidad]
  })

  data.unshift(['Categoria', 'Porcentaje'])

  return (
    <StatisticsGraphCard>
      {props.data.length > 0 && (
        <>
          <h2>&nbsp;</h2>
            <Chart chartType={'PieChart'} width={'100%'} height={'350px'} data={data} options={{
              pieHole: 0.4,
              is3D: false,
              colors: ['#1980EE', '#566C84', '#AAD3FF'],
              legend: {
                position: 'bottom',
                alignment: 'center',
                textStyle: {
                  fontSize: 14,
                },
              }
            }} />
        </>
      )}
    </StatisticsGraphCard>
  )
}

export default StatisticsStructuralHeight
