'use client'
import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  Legend,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts'
import { LaboratoryExams } from '@/models/statistics'
import StatisticsGraphCard from '../StatisticsGraphCard'

interface StatisticsLaboratoryExamsProps {
  data: LaboratoryExams[]
}

const size = {
  width: 400,
  height: 200
}

const StatisticsLaboratoryExams: React.FC<StatisticsLaboratoryExamsProps> = (
  props
) => {
  const data = props.data.map((item) => {
    return {
      porcentaje: item.cantidad,
      categoria: item.categoria
    }
  })

  const renderCustomizedLabel = (props: any) => {
    const { x, y, width, value } = props
    const radius = 10

    return (
      <g>
        <text
          x={x + width / 2}
          y={y - radius}
          fill='#000'
          textAnchor='middle'
          dominantBaseline='middle'
          fontSize={15}
          fontWeight={'bold'}
        >
          {value}%
        </text>
      </g>
    )
  }

  return (
    <StatisticsGraphCard>
      {props.data.length > 0 && (
        <>
          <h2>Exámenes</h2>
          <BarChart
            width={1100}
            height={400}
            data={data}
            margin={{
              top: 35,
              right: 35,
              left: 35,
              bottom: 35
            }}
          >
            <CartesianGrid strokeDasharray='5 5' />
            <XAxis
              dataKey='categoria'
              fontSize={11}
              fontWeight={'bold'}
              interval={0}
            >
              <LabelList dataKey='categoria' position='top' />
            </XAxis>
            <YAxis domain={[0, 100]} />
            <Tooltip />
            {/* <Legend /> */}
            <Bar dataKey='porcentaje' fill='#0496FF'>
              <LabelList
                dataKey='porcentaje'
                position='top'
                content={renderCustomizedLabel}
              />
            </Bar>
          </BarChart>
        </>
      )}
    </StatisticsGraphCard>
  )
}

export default StatisticsLaboratoryExams
