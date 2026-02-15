'use client'
import { Chart } from 'react-google-charts'
import { Ages } from '@/models/statistics'
import StatisticsGraphCard from '../StatisticsGraphCard'
import PieGraph from '../PieGraph'

interface StatisticsAgesProps {
  data: Ages[]
}

const StatisticsAges: React.FC<StatisticsAgesProps> = (props) => {
  const data = props.data.map((item) => ({
    label: item.rango_edad,
    value: item.cantidad
  }))
  // let data = props.data.map((item) => {
  //   return [item.rango_edad, item.cantidad]
  // })

  // data.unshift(['Categoria', 'Porcentaje'])

  return (
    <StatisticsGraphCard>
      {props.data.length > 0 && (
        <>
          <h2>Según edad</h2>
          <PieGraph data={data} />
          {/* <Chart chartType={'PieChart'} width={'530px'} height={'400px'} data={data} options={{
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
            }} /> */}
        </>
      )}
    </StatisticsGraphCard>
  )
}

export default StatisticsAges
