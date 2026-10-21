'use client'
import { useDispatch } from 'react-redux'
import { Rubik } from 'next/font/google'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronLeft, faUserAlt } from '@fortawesome/free-solid-svg-icons'
import LaboratoryExams from '../LaboratoryExams'
import SummaryExams from '../SummaryExams'
import { AppDispatch, useAppSelector } from '@/redux/store'
import {
  toggleDetail,
  toggleInterconsultas,
  toggleMedicalHistory,
  toggleRecomendaciones
} from '@/redux/features/medical-exams.slice'
import { formatFullName } from '@/shared/utils'
import TableDiagnosis from '../TableDiagnosis'
import Button from '../Button'
import styles from './detail-exams.module.css'
import { ROLES_TYPES } from '@/shared/constants'
import { useEffect } from 'react'
import { BaseApi } from '@/models/base'
import { openBase64InNewWindow } from '@/shared/base64'

const rubik400 = Rubik({ weight: '400', subsets: ['latin'] })
const rubik500 = Rubik({ weight: '500', subsets: ['latin'] })

const DetailExams: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()

  const details = useAppSelector((state) => state.medicalExamsReducer.details)
  const { currentUser } = useAppSelector((state) => state.authReducer)

  const handleBack = () => {
    dispatch(toggleDetail())
  }

  const handleShowMedicalHistory = () => {
    dispatch(toggleMedicalHistory())
  }

  const handleShowInterconsultas = () => {
    dispatch(toggleInterconsultas())
  }

  const handleShowRecomendaciones = () => {
    dispatch(toggleRecomendaciones())
  }

  const handleDownloadDiagnosis = async (
    cdg_fmed: string,
    diagnosisType: number
  ) => {
    const path = `/api/medical-exams/${cdg_fmed}/diagnosis`

    const body = {
      diagnosisType
    }

    const options = {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
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
      openBase64InNewWindow(
        result.data.file,
        `diagnosis_${cdg_fmed}_${diagnosisType}.pdf`,
        'application/pdf'
      )
    }
  }

  return (
    <>
      <div
        className={`${styles.backButton} ${rubik400.className}`}
        onClick={handleBack}
      >
        <FontAwesomeIcon icon={faChevronLeft} width={'12px'} height={'19px'} />{' '}
        Volver
      </div>
      {details.nombres && (
        <p className={`${styles.patientName} ${rubik500.className}`}>
          <span>
            <FontAwesomeIcon icon={faUserAlt} />
          </span>{' '}
          {formatFullName(`${details.nombres} ${details.apellidos}`)}
        </p>
      )}
      <div className={styles.container}>
        <div className={styles.overview}>
          <SummaryExams
            peso={details.peso}
            talla={details.talla}
            imc={details.imc}
            pamm={details.pamm}
            ps={details.ps}
          />
          <LaboratoryExams />
        </div>
        <TableDiagnosis uid={details.cdg_fmed} />
      </div>
      {currentUser.profile === ROLES_TYPES.DOCTOR && (
        <>
          <div className={styles.footer}>
            <Button
              label={'Ver recomendaciones'}
              onClick={handleShowRecomendaciones}
            />
            <Button
              label={'Ver Historial Clínico'}
              onClick={handleShowMedicalHistory}
            />
            <Button
              label={'Ver Interconsultas'}
              onClick={handleShowInterconsultas}
            />
          </div>
        </>
      )}
      {currentUser.profile === ROLES_TYPES.PATIENT && (
        <>
          <div className={styles.footerPatient}>
            <Button
              label={'Ver Informe Médico'}
              onClick={() => handleDownloadDiagnosis(details.cdg_fmed, 1)}
            />
            <Button
              label={'Ver Laboratorio'}
              onClick={() => handleDownloadDiagnosis(details.cdg_fmed, 5)}
            />
            <Button
              label={'Ver Recomendaciones'}
              onClick={handleShowRecomendaciones}
            />
            <Button
              label={'Ver Interconsultas'}
              onClick={handleShowInterconsultas}
            />
          </div>
        </>
      )}
    </>
  )
}

export default DetailExams
