'use client'
import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faChevronLeft,
  faDownload,
  faUserAlt
} from '@fortawesome/free-solid-svg-icons'
import { Rubik } from 'next/font/google'
import Panel from '../Panel'
import PanelIcon from '../PanelIcon'
import styles from './medical-history.module.css'
import { useDispatch } from 'react-redux'
import { AppDispatch, useAppSelector } from '@/redux/store'
import { toggleMedicalHistory } from '@/redux/features/medical-exams.slice'
import { formatFullName } from '@/shared/utils'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { BaseApi } from '@/models/base'
import ChartIMC from '../ChartIMC'
import ChartCardiology from '../ChartCardiology'
import ChartLaboratoryExams from '../ChartLaboratoryExams'
import { Radiology } from '@/models/radiology'
import { Audiometry } from '@/models/audiometry'
import Modal from '@/components/Modal'
import { base64ToFile } from '@/shared/base64'

const rubik400 = Rubik({ weight: '400', subsets: ['latin'] })
const rubik500 = Rubik({ weight: '500', subsets: ['latin'] })

const MedicalHistory: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()

  const [radiologyImage, setRadiologyImage] = useState<File[]>()
  const [radiologyDetails, setRadiologyDetails] = useState<Radiology[]>([])
  const [audiometryImage, setAudiometryImage] = useState<File[]>()
  const [audiometryDetails, setAudiometryDetails] = useState<Audiometry[]>([])

  const [showModal, setShowModal] = useState<boolean>(false)
  const [modalActive, setModalActive] = useState<number>(0)

  const details = useAppSelector((state) => state.medicalExamsReducer.details)

  const handleBack = () => {
    dispatch(toggleMedicalHistory())
  }

  const openModal = (index: number) => {
    setModalActive(index)
    setShowModal(true)
  }

  const downloadImage = (url: string) => {
    window.open(url, '_blank')
  }

  useEffect(() => {
    const getRadiologyImages = async () => {
      const url = `/api/medical-exams/historical/radiology/${details.num_dni}`
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          'Content-Type': 'application/json'
        }
      })

      const result: BaseApi = await response.json()

      if (result.error) {
        alert('Error al obtener las imágenes de radiología')
      }

      if (!result.status) {
        alert('Error al obtener las imágenes de radiología')
      }

      if (result.status) {
        setRadiologyDetails(result.data?.radiologies)
        const radiologyImages = result.data?.files // Array of base64 strings

        // Convert each base64 string to a File object
        const files = radiologyImages.map((base64: string, index: number) =>
          base64ToFile(base64, `radiology_${index}.jpg`, 'image/jpeg')
        )

        setRadiologyImage(files)
      }
    }

    const getAudiometryImages = async () => {
      const url = `/api/medical-exams/historical/audiometry/${details.num_dni}`
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          'Content-Type': 'application/json'
        }
      })

      const result: BaseApi = await response.json()

      if (result.error) {
        alert('Error al obtener las imágenes de audiometría')
      }

      if (!result.status) {
        alert('Error al obtener las imágenes de audiometría')
      }

      if (result.status) {
        setAudiometryDetails(result.data.audiometries)
        const audiometryImages = result.data?.files // Array of base64 strings

        // Convert each base64 string to a File object
        const files = audiometryImages.map((base64: string, index: number) =>
          base64ToFile(base64, `audiometry_${index}.png`, 'image/png')
        )

        setAudiometryImage(files)
      }
    }

    getRadiologyImages()
    getAudiometryImages()
  }, [details])

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
          <h2 className={styles.subtitle}>Historial Clínico</h2>
        </div>
        <PanelIcon title={'Radiología'} icon={'xray'}>
          <section className={styles.galleryContainer}>
            {radiologyImage?.map((image, index) => (
              <div key={`${image.name}`} className={styles.card}>
                <Image
                  src={URL.createObjectURL(image)}
                  width={190}
                  height={300}
                  priority
                  alt={''}
                  onClick={() => openModal(index)}
                />
                <p>
                  <strong>Radiografía de Tórax</strong>
                </p>
                <p>Tipo de exámen: {radiologyDetails[index]?.t_examen || ''}</p>
                <p>
                  Fecha: {radiologyDetails[index]?.fec_fmed.slice(0, 10) || ''}
                </p>
              </div>
            ))}
          </section>
        </PanelIcon>
        <PanelIcon title={'Audiometría'} icon={'audio'}>
          <section className={styles.galleryContainer}>
            {audiometryImage?.map((image, index) => (
              <div key={`${image.name}`} className={styles.card}>
                <Image
                  src={URL.createObjectURL(image)}
                  width={220}
                  height={320}
                  priority
                  alt={''}
                />
                <p>
                  <strong>{audiometryDetails[index]?.obs_audio || ''}</strong>
                </p>
                <p>
                  Tipo de exámen: {audiometryDetails[index]?.t_examen || ''}
                </p>
                <p>
                  Fecha: {audiometryDetails[index]?.fec_fmed.slice(0, 10) || ''}
                </p>
              </div>
            ))}
          </section>
        </PanelIcon>
        <section className={styles.two_columns}>
          <PanelIcon title={'Cardiología'} icon={'heart'}>
            <ChartCardiology dni={details.num_dni} />
          </PanelIcon>
          <PanelIcon title={'Peso - Índice de masa corporal'} icon={'weight'}>
            <ChartIMC dni={details.num_dni} />
          </PanelIcon>
        </section>
        <PanelIcon title={'Exámenes de Laboratorio'} icon={'laboratory'}>
          <ChartLaboratoryExams dni={details.num_dni} />
        </PanelIcon>
      </Panel>
      {showModal && (
        <Modal title={''}>
          {radiologyImage && radiologyImage[modalActive] && (
            <>
              <div className={styles.modalActions}>
                <p onClick={() => setShowModal(false)}>
                  <FontAwesomeIcon icon={faChevronLeft} /> VOLVER
                </p>
                <p>
                  <FontAwesomeIcon
                    icon={faDownload}
                    onClick={() =>
                      downloadImage(
                        URL.createObjectURL(radiologyImage[modalActive])
                      )
                    }
                  />
                </p>
              </div>
              <Image
                src={URL.createObjectURL(radiologyImage[modalActive])}
                width={1000}
                height={850}
                priority
                alt={''}
              />
            </>
          )}
        </Modal>
      )}
    </>
  )
}

export default MedicalHistory
