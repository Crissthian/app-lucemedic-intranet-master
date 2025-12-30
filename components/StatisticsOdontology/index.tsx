'use client'
import { Bar, BarChart, CartesianGrid, LabelList, Tooltip, XAxis, YAxis } from 'recharts'
import { Odontology } from '@/models/statistics'
import StatisticsGraphCard from '../StatisticsGraphCard'

interface StatisticsOdontologyProps {
  data: Odontology[];
}

const StatisticsOdontology: React.FC<StatisticsOdontologyProps> = (props) => {
  const data = props.data.map((item) => {
    return {
      porcentaje: item.cantidad,
      categoria: item.categoria,
    }
  })

  const renderCustomizedLabel = (props: any) => {
    const { x, y, width, value } = props
    const radius = 10

    return (
      <g>
        <text x={x + width / 2} y={y - radius} fill="#000" textAnchor="middle" dominantBaseline="middle" fontSize={15} fontWeight={'bold'}>
          {value}%
        </text>
      </g>
    )
  }
  return (
    <StatisticsGraphCard>
      {props.data.length > 0 && (
        <>
          <BarChart width={600} height={400} data={data} margin={{
            top: 20,
          }}>
            <CartesianGrid strokeDasharray="5 5" />
            <XAxis dataKey="categoria" fontSize={10} fontWeight={'bold'} interval={0}>
              <LabelList dataKey="categoria" position="top" />
            </XAxis>
            <YAxis domain={[0, 100]} />
            <Tooltip />
            <Bar dataKey="porcentaje" fill="#0496FF">
              <LabelList dataKey="porcentaje" position="top" content={renderCustomizedLabel} />
            </Bar>
          </BarChart>
        </>
      )}
    </StatisticsGraphCard>
  )
}

export default StatisticsOdontology
