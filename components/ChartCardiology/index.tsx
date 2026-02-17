'use client'
import { useEffect, useState } from 'react'
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
import { BaseApi } from '@/models/base'
import { CardiologyReport } from '@/models/cardiology-report'

interface ChartCardiologyProps {
  dni: string
}

const ChartCardiology: React.FC<ChartCardiologyProps> = (props) => {
  const [cardiologyReport, setCardiologyReport] = useState<CardiologyReport[]>(
    []
  )

  useEffect(() => {
    const getCardiologyReport = async () => {
      const url = `/api/medical-exams/historical/cardiology/${props.dni}`
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          'Content-Type': 'application/json'
        }
      })

      const result: BaseApi = await response.json()

      if (result.error) {
        alert('Error al obtener el reporte de cardiología')
      }

      if (!result.status) {
        alert('Error al obtener el reporte de cardiología')
      }

      if (result.status) {
        const data = result.data.cardiology_reports.map(
          (report: CardiologyReport) => {
            return {
              ...report,
              fec_reg: report.fec_reg.slice(0, 10)
            }
          }
        )
        setCardiologyReport(data)
      }
    }

    getCardiologyReport()
  }, [props])

  return (
    <>
      {cardiologyReport.length > 0 && (
        <BarChart width={550} height={400} data={cardiologyReport}>
          <CartesianGrid strokeDasharray='5 5' />
          <XAxis dataKey='fec_reg'>
            <LabelList dataKey='fec_reg' position='top' />
          </XAxis>
          <YAxis domain={[0, 100]} />
          <Tooltip />
          <Legend />
          <Bar dataKey='p_sistolica' fill='#0496FF'>
            <LabelList dataKey='p_sistolica' position='top' />
          </Bar>
          <Bar dataKey='p_diastolica' fill='#1973D6'>
            <LabelList dataKey='p_diastolica' position='top' />
          </Bar>
          <Bar dataKey='f_cardiaca' fill='#FF715B'>
            <LabelList dataKey='f_cardiaca' position='top' />
          </Bar>
        </BarChart>
      )}
    </>
  )
}

export default ChartCardiology
