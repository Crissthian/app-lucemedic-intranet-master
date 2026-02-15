'use client'
import { Rubik } from 'next/font/google'
import { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFile, faXRay } from '@fortawesome/free-solid-svg-icons'
import Button from '../Button'
import styles from './table-diagnosis.module.css'
import { BaseApi } from '@/models/base'
import { Diagnosis } from '@/models/diagnosis'
import Image from 'next/image'
import { useAppSelector } from '@/redux/store'
import { ROLES_TYPES } from '@/shared/constants'

interface TableDiagnosisProps {
  uid: string;
}

const rubik400 = Rubik({ weight: '400', subsets: ['latin'] })

const TableDiagnosis: React.FC<TableDiagnosisProps> = (props) => {
  const [loading, setLoading] = useState<boolean>(false)
  const [diagnosis, setDiagnosis] = useState<Diagnosis[]>([])

  const { currentUser } = useAppSelector((state) => state.authReducer)

  const handleDownloadDiagnosis = async (type: string) => {
    const path = `/api/medical-exams/${props.uid}/diagnosis`

    let diagnosisType: number = 1

    switch (type) {
      case 'Medicina':
        diagnosisType = 1
        break
      case 'Oftalmología':
        diagnosisType = 2
        break
      case 'Otorrino':
        diagnosisType = 3
        break
      case 'Radiología':
        diagnosisType = 4
        break
      case 'Laboratorio':
        diagnosisType = 5
        break
      case 'Odontología':
        diagnosisType = 6
        break
      case 'Cardiología':
        diagnosisType = 7
        break
      case 'Espirometría':
        diagnosisType = 8
        break
      case 'Psicología':
        diagnosisType = 9
        break
      case 'Historia Ocupacional':
        diagnosisType = 10
        break
      case 'Musculo Esquelética':
        diagnosisType = 11
        break
      case 'Ficha 312':
        diagnosisType = 12
        break
      case 'Anexo 16':
        diagnosisType = 13
        break
      case 'Altura':
        diagnosisType = 14
        break
      case 'Anexo 16A':
        diagnosisType = 15
        break
      default:
        diagnosisType = 1
        break
    }

    const body = {
      diagnosisType,
    }

    const options = {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    }

    const response = await fetch(path, options)

    const result: BaseApi = await response.json()

    if (result.error) {
      alert('Error al obtener el diagnóstico')
    }

    if (!result.status) {
      alert('Error al obtener el diagnóstico')
    }

    if (result.status) {
      const { file } = result.data

      const url = `/api/commons/file/${file}`

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          'Content-Type': 'application/json',
        },
      })

      const data = await response.blob()

      const blob = new File([data], file, { type: 'application/pdf' })

      const urlBlob = URL.createObjectURL(blob)

      window.open(urlBlob)
    }
  }

  const handleDownloadRadiology = async (cdg_fmed: string) => {
    const path = `/api/medical-exams/${cdg_fmed}/diagnosis/xray`

    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        'Content-Type': 'application/json',
      },
    }

    const response = await fetch(path, options)

    const result: BaseApi = await response.json()

    if (result.error) {
      alert('Error al obtener el diagnóstico')
    }

    if (!result.status) {
      alert('Error al obtener el diagnóstico')
    }

    if (result.status) {
      const { file } = result.data

      const url = `/api/commons/file/${file}`

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          'Content-Type': 'application/json',
        },
      })

      const data = await response.blob()

      const blob = new File([data], file, { type: 'image/jpg' })

      const urlBlob = URL.createObjectURL(blob)

      window.open(urlBlob)
    }
  }

  useEffect(() => {
    const getDiagnosis = async () => {
      setLoading(true)
      const url = `/api/medical-exams/${props.uid}/diagnosis`

      const options = {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          'Content-Type': 'application/json',
        },
      }

      const response = await fetch(url, options)

      const result: BaseApi = await response.json()

      if (result.error) {
        alert('No se pudo descargar el diagnóstico')
        return
      }

      if (!result.status) {
        alert('No se pudo descargar el diagnóstico')
        return
      }

      if (result.status) {
        setDiagnosis(result.data.diagnosis)
        setLoading(false)
      }
    }

    getDiagnosis()
  }, [props.uid])

  return (
    <div>
      <div className={styles.header}>
        <div className={rubik400.className}>
          <span>
            <FontAwesomeIcon icon={faFile} />
          </span>{' '}
          Área
        </div>
        <div className={rubik400.className}>
          <span>
            <FontAwesomeIcon icon={faFile} />
          </span>{' '}
          Diagnóstico
        </div>
        {
          currentUser.profile === ROLES_TYPES.DOCTOR && (
            <div className={rubik400.className}>
              <span>
                <FontAwesomeIcon icon={faFile} />
              </span>{' '}
              Informe
            </div>
          )
        }
        
      </div>
      <div className={styles.body}>
        {loading && (
          <div className={styles.loaderContainer}>
            <Image src={'/loader.svg'} alt="loading" width={50} height={50} />
          </div>
        )}
        {diagnosis.map((item, index) => (
          <div key={index} className={styles.row}>
            <span>{item.type}</span>
            <span className={styles.diagnosis}>{item.data}</span>
            {currentUser.profile === ROLES_TYPES.DOCTOR && (
              <span>
                <Button
                  label={'Ver'}
                  onClick={() => handleDownloadDiagnosis(item.type)}
                  disabled={item.data === '-' ? true : false}
                  width="100px"
                />
                {
                  item.type === 'Radiología' && (
                    <FontAwesomeIcon icon={faXRay} style={{ marginLeft: '15px', cursor: 'pointer', width: '20px', height: '20px' }} width={'20px'} height={'30px'} onClick={() => handleDownloadRadiology(props.uid)} />
                  )
                }
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default TableDiagnosis

