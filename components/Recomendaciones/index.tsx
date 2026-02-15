'use client'
import 'moment/locale/es'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import moment from 'moment'
import { AppDispatch, useAppSelector } from '@/redux/store'
import { useDispatch } from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faBell,
  faChevronLeft,
  faCircleInfo,
  faFile,
  faFilePdf,
  faUserAlt
} from '@fortawesome/free-solid-svg-icons'
import { toggleRecomendaciones } from '@/redux/features/medical-exams.slice'
import { Rubik } from 'next/font/google'
import Panel from '../Panel'
import { formatFullName } from '@/shared/utils'
import styles from './recomendaciones.module.css'
import { Recommendations } from '@/models/recommendations'
import { BaseApi } from '@/models/base'

const rubik400 = Rubik({ weight: '400', subsets: ['latin'] })
const rubik500 = Rubik({ weight: '500', subsets: ['latin'] })

moment.locale('es')

const Recomendaciones: React.FC = () => {
  const router = useRouter()
  const dispatch = useDispatch<AppDispatch>()

  const details = useAppSelector((state) => state.medicalExamsReducer.details)

  const [recommendations, setRecommendations] = useState<Recommendations[]>([])

  const handleBack = () => {
    dispatch(toggleRecomendaciones())
  }

  const handleDownload = async (cdg_fmed: string) => {
    const url = `/api/medical-exams/${details.cdg_fmed}/recommendations/${cdg_fmed}`

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
      const url = `/api/commons/file/${result.data.file}`

      const data = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          'Content-Type': 'application/json'
        }
      })

      const blob = await data.blob()

      const file = new File([blob], result.data.file, {
        type: 'application/pdf'
      })

      const urlFile = window.URL.createObjectURL(file)

      window.open(urlFile)
    }
  }

  useEffect(() => {
    const jwt = localStorage.getItem('accessToken') || ''

    if (jwt.length <= 0) {
      router.push('/auth')
    }

    if (details.cdg_fmed) {
      const getRecommendations = async () => {
        const url = `/api/medical-exams/${details.cdg_fmed}/recommendations`
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
          setRecommendations(result.data.recommendations)
        }
      }

      getRecommendations()
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
        {recommendations.length === 0 && (
          <>
            <div className={`${rubik400.className} ${styles.empty}`}>
              <FontAwesomeIcon icon={faBell} color='#1EE67D' />
              <p>
                Su evaluación no <br />
                requiere recomendaciones
              </p>
            </div>
          </>
        )}
        {recommendations.length > 0 && (
          <div className={styles.dataTable}>
            <div className={`${rubik400.className} ${styles.dataTableHeader}`}>
              <div>
                <FontAwesomeIcon icon={faCircleInfo} /> Recomendación
              </div>
              <div>
                <FontAwesomeIcon icon={faFile} />
                Descargar
              </div>
            </div>
            <div className={styles.dataTableBody}>
              {recommendations.length > 0 ? (
                <>
                  {recommendations.map((recommendation, index) => (
                    <div
                      key={index}
                      className={`${rubik400.className} ${styles.dataTableRow}`}
                    >
                      <div>{recommendation.descripcion}</div>
                      <div>
                        <FontAwesomeIcon
                          icon={faFilePdf}
                          width={'10px'}
                          onClick={() => handleDownload(recommendation.cdg_reg)}
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

export default Recomendaciones
