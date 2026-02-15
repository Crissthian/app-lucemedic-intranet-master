'use client'

import { useEffect, useState } from 'react'
import { LaboratoryExamReport } from '@/models/laboratory-exam-report'
import { BaseApi } from '@/models/base'
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
// import { BarChart } from '@mui/x-charts'

interface ChartLaboratoryExamsProps {
  dni: string
}

const ChartLaboratoryExams: React.FC<ChartLaboratoryExamsProps> = (props) => {
  const [laboratoryExams, setLaboratoryExams] = useState<
    LaboratoryExamReport[]
  >([])

  useEffect(() => {
    const getLaboratoryExamReport = async () => {
      const url = `/api/medical-exams/historical/laboratory-exams/${props.dni}`
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          'Content-Type': 'application/json'
        }
      })

      const result: BaseApi = await response.json()

      if (result.error) {
        alert('Error al obtener el reporte de laboratorio')
      }

      if (!result.status) {
        alert('Error al obtener el reporte de laboratorio')
      }

      if (result.status) {
        const data = result.data.laboratory_exams_reports.map(
          (report: LaboratoryExamReport) => {
            return {
              ...report,
              fec_reg: report.fec_reg.slice(0, 10),
              glucosa: report.glucosa === '-' ? 0 : report.glucosa,
              trigliceridos:
                report.trigliceridos === '-' ? 0 : report.trigliceridos,
              colesterol: report.colesterol === '-' ? 0 : report.colesterol
            }
          }
        )

        setLaboratoryExams(data)
      }
    }

    getLaboratoryExamReport()
  }, [props])
  return (
    <>
      {laboratoryExams.length > 0 && (
        <BarChart width={1050} height={400} data={laboratoryExams}>
          <CartesianGrid strokeDasharray='5 5' />
          <XAxis dataKey='fec_reg'>
            <LabelList dataKey='fec_reg' position='top' />
          </XAxis>
          <YAxis domain={[0, 100]} />
          <Tooltip />
          <Legend />
          <Bar dataKey='hemoglobina' fill='#FE7E6B'>
            <LabelList dataKey='hemoglobina' position='top' />
          </Bar>
          <Bar dataKey='colesterol' fill='#6665DD'>
            <LabelList dataKey='colesterol' position='top' />
          </Bar>
          <Bar dataKey='trigliceridos' fill='#0496FF'>
            <LabelList dataKey='trigliceridos' position='top' />
          </Bar>
          <Bar dataKey='glucosa' fill='#34D1BF'>
            <LabelList dataKey='glucosa' position='top' />
          </Bar>
        </BarChart>
        // <BarChart
        //   xAxis={[
        //     {
        //       scaleType: 'band',
        //       data: laboratoryExams.map((report) => report.cdg_reg),
        //     },
        //   ]}
        //   series={[
        //     {
        //       type: 'bar',
        //       label: 'HEMOGLOBINA',
        //       data: laboratoryExams.map((report) => parseInt(report.hemoglobina, 10)),
        //     },
        //     { type: 'bar', label: 'COLESTEROL', data: laboratoryExams.map((report) => parseInt(report.colesterol, 10)) },
        //     {
        //       type: 'bar',
        //       label: 'TRIGLICÉRIDOS',
        //       data: laboratoryExams.map((report) => parseInt(report.trigliceridos, 10))
        //     },
        //     { type: 'bar', label: 'GLUCOSA', data: laboratoryExams.map((report) => parseInt(report.glucosa, 10)) },
        //   ]}
        //   width={950}
        //   height={350}
        //   colors={['#0496FF', '#1973D6', '#FF715B']}
        //   margin={{ top: 20, right: 50, bottom: 100, left: 50 }}
        //   slotProps={{
        //     legend: {
        //       direction: 'row',
        //       position: {
        //         vertical: 'bottom',
        //         horizontal: 'middle',
        //       },
        //       itemMarkWidth: 20,
        //       itemMarkHeight: 2,
        //       markGap: 10,
        //       itemGap: 10,
        //     },
        //   }}
        // />
      )}
    </>
  )
}

export default ChartLaboratoryExams
