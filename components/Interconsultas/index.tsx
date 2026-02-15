'use client'
import 'moment/locale/es'
import moment from 'moment'
import { AppDispatch, useAppSelector } from '@/redux/store'
import { useDispatch } from 'react-redux'
import { useRouter } from 'next/navigation'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faBell,
  faChevronLeft,
  faCircleInfo,
  faFile,
  faFilePdf,
  faUserAlt
} from '@fortawesome/free-solid-svg-icons'
import { toggleInterconsultas } from '@/redux/features/medical-exams.slice'
import { Rubik } from 'next/font/google'
import Panel from '../Panel'
import styles from './interconsultas.module.css'
import { useEffect, useState } from 'react'
import { formatFullName } from '@/shared/utils'
import { BaseApi } from '@/models/base'
import { Consultations } from '@/models/consultations'
import { openBase64InNewWindow } from '@/shared/base64'

const rubik400 = Rubik({ weight: '400', subsets: ['latin'] })
const rubik500 = Rubik({ weight: '500', subsets: ['latin'] })

moment.locale('es')

const Interconsultas: React.FC = () => {
  const router = useRouter()
  const dispatch = useDispatch<AppDispatch>()

  const details = useAppSelector((state) => state.medicalExamsReducer.details)

  const [consultations, setConsultations] = useState<Consultations[]>([])

  const handleBack = () => {
    dispatch(toggleInterconsultas())
  }

  const handleDownload = async (num_interconsulta: string) => {
    const url = `/api/medical-exams/${details.cdg_fmed}/consultations/${num_interconsulta}`

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
        `consultation_${num_interconsulta}.pdf`,
        'application/pdf'
      )
    }
  }

  useEffect(() => {
    const jwt = localStorage.getItem('accessToken') || ''

    if (jwt.length <= 0) {
      router.push('/auth')
    }

    if (details.cdg_fmed) {
      const getConsultations = async () => {
        const url = `/api/medical-exams/${details.cdg_fmed}/consultations`
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`
          }
        })
        const result: BaseApi = await response.json()

        if (result.error) {
          localStorage.removeItem('accessToken')
          router.push('/auth')
        }

        if (result.status) {
          setConsultations(result.data.consultations)
        }
      }

      getConsultations()
    }
  }, [router, details.cdg_fmed])

  return (
    <>
      <Panel>
        <div
          className={`${styles.backButton} ${rubik400.className}`}
          onClick={handleBack}
        >
          <FontAwesomeIcon
            icon={faChevronLeft}
            width={'12px'}
            height={'19px'}
          />{' '}
          Volver
        </div>
        <div className={styles.header}>
          <p className={`${styles.patientName} ${rubik500.className}`}>
            <span>
              <FontAwesomeIcon icon={faUserAlt} />
            </span>{' '}
            {formatFullName(`${details.nombres} ${details.apellidos}`)}
          </p>
        </div>
        {consultations.length === 0 && (
          <div className={`${rubik400.className} ${styles.empty}`}>
            <FontAwesomeIcon icon={faBell} color='#1EE67D' />
            <p>
              Su evaluación no <br />
              registra interconsultas
            </p>
          </div>
        )}
        {consultations.length > 0 && (
          <div className={styles.dataTable}>
            <div className={`${rubik400.className} ${styles.dataTableHeader}`}>
              <div>
                <FontAwesomeIcon icon={faCircleInfo} /> N. Interc.
              </div>
              <div>
                <FontAwesomeIcon icon={faCircleInfo} />
                Fecha
              </div>
              <div>
                <FontAwesomeIcon icon={faCircleInfo} />
                Especialidad
              </div>
              <div>
                <FontAwesomeIcon icon={faCircleInfo} />
                Motivo
              </div>
              <div>
                <FontAwesomeIcon icon={faCircleInfo} />
                Estado
              </div>
              <div>
                <FontAwesomeIcon icon={faCircleInfo} />
                Tipo
              </div>
              <div>
                <FontAwesomeIcon icon={faFile} />
                Descargar
              </div>
            </div>
            <div className={styles.dataTableBody}>
              {consultations.length > 0 ? (
                <>
                  {consultations.map((consultation, index) => (
                    <div
                      key={index}
                      className={`${rubik400.className} ${styles.dataTableRow}`}
                    >
                      <div>{consultation.num_interconsulta}</div>
                      <div>
                        {moment(consultation.fec_reg.split('T')[0]).format(
                          'LL'
                        )}
                      </div>
                      <div>{consultation.especialidad}</div>
                      <div>{consultation.motivo}</div>
                      <div>{consultation.estado}</div>
                      <div>{consultation.tipo}</div>
                      <div>
                        <FontAwesomeIcon
                          icon={faFilePdf}
                          width={'10px'}
                          onClick={() =>
                            handleDownload(consultation.num_interconsulta)
                          }
                        />
                      </div>
                    </div>
                  ))}
                </>
              ) : (
                ''
              )}
            </div>
          </div>
        )}
      </Panel>
    </>
  )
}

export default Interconsultas
