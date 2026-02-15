'use client'
import Header from '@/components/Header'
import Navigation from '@/components/Navigation'
import Panel from '@/components/Panel'
import styles from './appointments.module.css'
import Image from 'next/image'
import {useEffect, useState} from 'react'
import {useRouter} from 'next/navigation'
import {useDispatch} from 'react-redux'
import {AppDispatch} from '@/redux/store'
import {BaseApi} from '@/models/base'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faDownload, faUpload} from '@fortawesome/free-solid-svg-icons'
import {Rubik} from 'next/font/google'
import Button from '@/components/Button'
import {toggleLoading} from '@/redux/features/global.slice'

const rubik500 = Rubik({weight: '500', subsets: ['latin']})

export default function Appointments() {
  const router = useRouter()
  const dispatch = useDispatch<AppDispatch>()

  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [success, setSuccess] = useState<boolean>(false)

  const handleSelectFile = async () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.xlsx'
    input.click()

    input.onchange = async (e) => {
      const files = (e.target as HTMLInputElement).files
      if (files && files.length > 0) {
        setSelectedFile(files[0])
      }
    }
  }

  const handleDownloadTemplate = () => {
    window.open('/formato-citas.xlsx', '_blank')
  }

  const handleUpload = async () => {
    dispatch(toggleLoading())

    if (!selectedFile) return

    const formData = new FormData()
    formData.append('file', selectedFile)

    const url = '/api/appointments'

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
        body: formData,
      })

      const result: BaseApi = await response.json()

      if (result.error) {
        alert('Ocurrió un error al subir el archivo.')
      } else {
        dispatch(toggleLoading())
        setSuccess(true)
      }

      setSelectedFile(null)
    } catch (error) {
      console.error('Error uploading file:', error)
      alert('Ocurrió un error al subir el archivo.')
    }
  }

  useEffect(() => {

    const jwt = localStorage.getItem('accessToken') || ''

    if (jwt.length <= 0) {
      router.push('/auth')
    }

  }, [router])

  return (
    <>
      <Header/>
      <main className={styles.main}>
        <Navigation/>
        <Panel>
          <p className={styles.title}>Programa las citas de tus colaboradores de manera rápida en solo <span>3 simples pasos.</span>
          </p>
          <div className={styles.container}>
            <Image src={'/caption-citas.png'} alt={'Citas'} width={500} height={500} priority/>
            <div className={styles.buttonsContainer}>
              <div className={`${rubik500.className} ${styles.button}`} onClick={handleDownloadTemplate}>
                <FontAwesomeIcon icon={faDownload} fill="#1EE67D"/> Descargar formato de programación
              </div>
              <Image src={'/capture.png'} alt={'Excel'} width={300} height={200} priority/>
              <div className={`${rubik500.className} ${styles.button}`} onClick={handleSelectFile}><FontAwesomeIcon
                icon={faUpload} fill="#1EE67D"/> Importar formato de programación
              </div>
            </div>
          </div>
          <div className={styles.footer}>
            {
              selectedFile && (
                <Button label="Enviar" onClick={() => handleUpload()}/>
              )
            }
            {
              success && (
                <div className={styles.message}>
                  <p><strong>¡Listo! Tus citas han sido enviadas.</strong></p>
                  <p><small>Un asesor comercial se comunicará contigo.</small></p>
                </div>
              )
            }
          </div>
        </Panel>
      </main>
    </>
  )
}
