'use client'
import { OsteoMuscularPathologies } from '@/models/statistics'
import StatisticsGraphCard from '../StatisticsGraphCard'
import { Bar, BarChart, CartesianGrid, LabelList, Legend, Tooltip, XAxis, YAxis } from 'recharts'

interface StatisticsOsteoMuscularPathologiesProps {
  data: OsteoMuscularPathologies[];
}

const size = {
  width: 400,
  height: 200,
}

const StatisticsOsteoMuscularPathologies: React.FC<StatisticsOsteoMuscularPathologiesProps> = (props) => {
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
          <h2>Patologías osteo musculares</h2>
          <BarChart width={1000} height={400} data={data} margin={{
            top: 35,
            right: 0,
            left: 0,
            bottom: 35
          }}>
            <CartesianGrid strokeDasharray="5 5" />
            <XAxis dataKey="categoria" fontWeight={'bold'} fontSize={11} interval={0}>
              <LabelList dataKey="categoria" position="top" />
            </XAxis>
            <YAxis domain={[0, 100]} />
            <Tooltip />
            {/* <Legend /> */}
            <Bar dataKey="porcentaje" fill="#0496FF">
              <LabelList dataKey="porcentaje" position="top" content={renderCustomizedLabel} />
            </Bar>
          </BarChart>
        </>
      )}
    </StatisticsGraphCard>
  )
}

export default StatisticsOsteoMuscularPathologies
