'use client'
import React from 'react'
import { useDispatch } from 'react-redux'
import { useRouter } from 'next/navigation'
import { AppDispatch } from '@/redux/store'
import styles from './data-table-patient.module.css'
import { Roboto, Rubik } from 'next/font/google'
import { formatFullName } from '@/shared/utils'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faCircleInfo,
  faFile,
  faUserAlt
} from '@fortawesome/free-solid-svg-icons'
import Button from '../Button'
import { toggleLoading } from '@/redux/features/global.slice'
import { BaseApi } from '@/models/base'
import { getDetail, toggleDetail } from '@/redux/features/medical-exams.slice'
import { HEADQUARTERS_OPTIONS } from '@/shared/constants'

const rubik = Rubik({ weight: '400', subsets: ['latin'] })
const roboto400 = Roboto({ weight: '400', subsets: ['latin'] })

interface DataTableProps {
  data: Array<any>
}

const DataTablePatient: React.FC<DataTableProps> = (props) => {
  const router = useRouter()
  const dispatch = useDispatch<AppDispatch>()

  const handleDetail = async (fmed: string) => {
    dispatch(toggleLoading())
    const url = `/api/medical-exams/${fmed}`

    const data = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        'Content-Type': 'application/json'
      }
    })

    const result: BaseApi = await data.json()

    if (result.error) {
      localStorage.removeItem('accessToken')
      router.push('/auth')
    }

    if (!result.status) {
      alert('No se pudo obtener el detalle del examen médico')
    }

    if (result.status) {
      dispatch(getDetail(result.data))
      dispatch(toggleDetail())
      dispatch(toggleLoading())
    }
  }

  const showDetailView = async (fmed: string) => {
    await handleDetail(fmed)
  }

  const getSede = (sede: string) => {
    return (
      HEADQUARTERS_OPTIONS.find((item) => item.value === sede)?.label || '-'
    )
  }

  return (
    <>
      {props.data.length > 0 && (
        <div className={styles.container}>
          <div className={styles.header}>
            <div>
              <FontAwesomeIcon icon={faUserAlt} /> Nombres y Apellidos
            </div>
            <div>
              <FontAwesomeIcon icon={faFile} /> Empresa
            </div>
            <div>
              <FontAwesomeIcon icon={faFile} />
              Sede
            </div>
            <div>
              <FontAwesomeIcon icon={faFile} />
              Aptitud
            </div>
            <div>
              <FontAwesomeIcon icon={faCircleInfo} /> Detalle
            </div>
          </div>
          <div className={styles.body}>
            {props.data.map((item, index) => (
              <div key={index} className={styles.dataTableItem}>
                {/* <div><input key={index} type="checkbox" checked={selecteds.includes(item.cdg_fmed)} onChange={() => handleChecked(item.cdg_fmed)} /></div> */}
                <div className={`${styles.title} ${roboto400.className}`}>
                  <p>{formatFullName(`${item.apellidos} ${item.nombres} `)}</p>
                  <p className={`${styles.subtitle} ${rubik.className}`}>
                    <span>Ficha N° {item.cdg_fmed}</span> /{' '}
                    <span>Fecha de atención: {item.fec_fmed}</span> /{' '}
                    <span>Tipo de examen: {item.t_examen}</span>
                  </p>
                </div>
                <div className={styles.empresa}>
                  <p>{item.empresa}</p>
                </div>
                <div className={styles.sede}>
                  <p>{getSede(item.cdg_sede)}</p>
                </div>
                <div className={styles.status}>
                  <p>{item.aptitud}</p>
                </div>
                <div className={styles.dataTableItemActions}>
                  <Button
                    key={index}
                    label='Ver más'
                    onClick={() => showDetailView(`${item.cdg_fmed}`)}
                    width='120px'
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  )
}

export default DataTablePatient
