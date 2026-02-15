'use client'

import { useEffect, useState } from 'react'
// import { BarChart } from '@mui/x-charts'
import { BaseApi } from '@/models/base'
import { IMCReport } from '@/models/imc-report'
import { Bar, BarChart, CartesianGrid, LabelList, Legend, Line, LineChart, Tooltip, XAxis, YAxis } from 'recharts'

interface ChartIMCProps {
  dni: string;
}

const ChartIMC: React.FC<ChartIMCProps> = (props) => {
  const [imcReport, setImcReport] = useState<IMCReport[]>([])

  useEffect(() => {
    const getImcReport = async () => {
      const url = `/api/medical-exams/historical/imc/${props.dni}`
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          'Content-Type': 'application/json',
        },
      })

      const result: BaseApi = await response.json()

      if (result.error) {
        alert('Error al obtener el reporte de cardiología')
      }

      if (!result.status) {
        alert('Error al obtener el reporte de cardiología')
      }

      if (result.status) {
        const data = result.data.imc_reports.map((report: IMCReport) => {
          return {
            ...report,
            fec_reg: report.fec_reg.slice(0, 10),
          }
        })
        setImcReport(data)
      }
    }

    getImcReport()
  }, [props])

  return (
    <>
      {imcReport.length > 0 && (
        <LineChart
          width={550}
          height={400}
          data={imcReport}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="5 5" />
          <XAxis dataKey="fec_reg">
            <LabelList dataKey="fec_reg" position="top" />
          </XAxis>
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="peso" stroke="#0496FF" activeDot={{ r: 10 }} strokeWidth={2}>
            <LabelList dataKey="peso" position="top" />
          </Line>
          <Line type="monotone" dataKey="imc" stroke="#8E3DBA" activeDot={{ r: 8 }} strokeWidth={2}>
            <LabelList dataKey="imc" position="top" />
          </Line>
        </LineChart>
        // <BarChart width={550} height={400} data={imcReport}>
        //   <CartesianGrid strokeDasharray="3 3" />
        //   <XAxis dataKey="fec_reg">
        //     <LabelList dataKey="fec_reg" position="top" />
        //   </XAxis>
        //   <YAxis />
        //   <Tooltip />
        //   <Legend />
        //   <Bar dataKey="peso" fill="#0496FF">
        //     <LabelList dataKey="peso" position="top" />
        //   </Bar>
        //   <Bar dataKey="imc" fill="#8E3DBA">
        //     <LabelList dataKey="imc" position="top" />
        //   </Bar>
        // </BarChart>
        // <BarChart
        //   xAxis={[
        //     {
        //       scaleType: 'band',
        //       data: imcReport.map((item) => item.fec_reg.slice(0, 10)),
        //     },
        //   ]}
        //   series={[
        //     {
        //       type: 'bar',
        //       label: 'PESO',
        //       data: imcReport.map((item) => item.peso),
        //     },
        //     {
        //       type: 'bar',
        //       label: 'I.M.C.',
        //       data: imcReport.map((item) => item.imc),
        //     },
        //   ]}
        //   width={550}
        //   height={400}
        //   colors={['#0496FF', '#8E3DBA']}
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

export default ChartIMC

