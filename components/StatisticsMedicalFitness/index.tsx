'use client'
import { Chart } from 'react-google-charts'
import { MedicalFitness } from '@/models/statistics'
import StatisticsGraphCard from '../StatisticsGraphCard'

interface StatisticsMedicalFitnessProps {
  data: MedicalFitness[];
}

const StatisticsMedicalFitness: React.FC<StatisticsMedicalFitnessProps> = (
  props
) => {

  if (props.data.length === 0) return null

  let data = [
    [
      'Apto',
      props.data[0].APTO
    ],
    [
      'Apto con restricciones',
      props.data[0].APTO_CON_RESTRICCIONES
    ],
    [
      'No apto',
      props.data[0].NO_APTO
    ],
    [
      'Observado',
      props.data[0].OBSERVADO
    ],
  ]

  data.unshift(['Categoria', 'Porcentaje'])

  return (
    <StatisticsGraphCard>
      {props.data.length > 0 && (
        <>
          <h2>Según aptitud médica</h2>
          <Chart chartType={'PieChart'} width={'400px'} height={'400px'} data={data} options={{
            pieHole: 0.4,
            is3D: false,
            colors: ['#6B2B8E', '#94889B', '#C18AE0', '#E3D3F2'],
            legend: {
              position: 'bottom',
              alignment: 'center',
              textStyle: {
                fontSize: 14
              }
            }
          }} />
        </>
      )}
    </StatisticsGraphCard>
  )
}

export default StatisticsMedicalFitness
