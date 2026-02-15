'use client'
import { Rubik } from 'next/font/google'
import styles from './table-epidemiological.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faCalendarDays,
  faClinicMedical,
  faFile
} from '@fortawesome/free-solid-svg-icons'
import Button from '../Button'
import { useEffect, useState } from 'react'
import { EpidemiologicalReport } from '@/models/epidemiological-report'
import { BaseApi } from '@/models/base'
import { openBase64InNewWindow } from '@/shared/base64'

const rubik400 = Rubik({ weight: '400', subsets: ['latin'] })

const TableEpidemiological: React.FC = () => {
  const [data, setData] = useState<EpidemiologicalReport[]>([])

  const handleDownload = async (cdg_reg: string) => {
    const url = `/api/commons/epidemiological-report/${cdg_reg}`

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`
      }
    })

    const result: BaseApi = await response.json()

    if (result.error) {
      alert('No se logró descargar el archivo.')
    }

    if (!result.status) {
      alert('No se logró descargar el archivo.')
    }

    if (result.status) {
      openBase64InNewWindow(
        result.data.file,
        `epidemiological_${cdg_reg}.pdf`,
        'application/pdf'
      )
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      const url = '/api/commons/epidemiological-report'

      const data = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        }
      })

      const result: BaseApi = await data.json()

      if (!result.status) {
        alert('Ocurrió un error al obtener los datos.')
      }

      if (result.status) {
        setData(result.data.epidemiological_report)
      }
    }

    fetchData()
  }, [])
  return (
    <div className={styles.table}>
      <div className={styles.header}>
        <div className={rubik400.className}>
          <span>
            <FontAwesomeIcon icon={faCalendarDays} size={'1x'} />
          </span>{' '}
          Periodo
        </div>
        <div className={rubik400.className}>
          <span>
            <FontAwesomeIcon icon={faClinicMedical} size={'1x'} />
          </span>{' '}
          Tipo
        </div>
        <div className={rubik400.className}>
          <span>
            <FontAwesomeIcon icon={faFile} size={'1x'} />
          </span>{' '}
          Informe
        </div>
      </div>
      <div className={styles.body}>
        {data.map((item, index) => (
          <div key={index} className={styles.row}>
            <span>{item.periodo}</span>
            <span>{item.tipo}</span>
            <span>
              <Button
                label={'Ver'}
                onClick={() => handleDownload(item.cdg_reg)}
              />
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default TableEpidemiological
