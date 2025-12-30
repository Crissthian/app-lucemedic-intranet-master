'use client'
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  Legend,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import StatisticsGraphCard from '../StatisticsGraphCard'
import { NutritionalProfile } from '@/models/nutritional-profile'

interface StatisticsIMCProps {
  data: NutritionalProfile[];
}

const StatisticsIMC: React.FC<StatisticsIMCProps> = (props) => {
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
          <h2>Perfil Nutricional (IMC)</h2>
          <BarChart width={650} height={400} data={props.data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="categoria" fontSize={11} fontWeight={'bold'} interval={0}>
              <LabelList dataKey="categoria" position="top" />
            </XAxis>
            <YAxis domain={[0, 100]} />
            <Tooltip />
            <Bar dataKey="cantidad" fill="#0496FF">
              <LabelList dataKey="cantidad" position="top" content={renderCustomizedLabel} />
            </Bar>
          </BarChart>
        </>
      )}
    </StatisticsGraphCard>
  )
}

export default StatisticsIMC
