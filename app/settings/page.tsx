'use client'
import { useEffect, useState } from 'react'
import Header from '@/components/Header'
import styles from './settings.module.css'
import Navigation from '@/components/Navigation'
import Panel from '@/components/Panel'
import { Rubik } from 'next/font/google'
import Input from '@/components/Input'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faImage, faLock } from '@fortawesome/free-solid-svg-icons'
import Button from '@/components/Button'
import { BaseApi } from '@/models/base'
import { ROLES_TYPES } from '@/shared/constants'
import useUserProfile from '@/hooks/useUserProfile'
import { useRouter } from 'next/navigation'

const rubik = Rubik({ weight: '600', subsets: ['latin'] })

export default function Settings() {
  const router = useRouter()
  const currentUser = useUserProfile()

  const [dni, setDni] = useState<string>('')
  const [firstName, setFirstName] = useState<string>('')
  const [lastName, setLastName] = useState<string>('')
  const [cmp, setCmp] = useState<string>('')
  const [email, setEmail] = useState<string>('')
  const [phone, setPhone] = useState<string>('')
  const [birthDate, setBirthDate] = useState<string>('')
  const [selectedFile, setSelectedFile] = useState<File | undefined>()
  const [preview, setPreview] = useState<string | ArrayBuffer | null>(null)

  const handleFileChange = (e: any) => {
    const target = e.target as HTMLInputElement & {
      files: FileList
    }

    setSelectedFile(target.files[0])

    const file = new FileReader()

    file.onload = () => {
      setPreview(file.result)
    }

    file.readAsDataURL(target.files[0])
  }

  const handleRemoveImage = () => {
    setPreview(null)
  }

  const handleLogout = () => {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('profileLogged')
    window.location.reload()
  }

  const handleUploadPhoto = async () => {
    try {
      const formData = new FormData()
      formData.append('file', selectedFile || '')

      const data = await fetch('/api/commons/users/photo', {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        },
        body: formData
      })

      const result: BaseApi = await data.json()

      if (!result.status) {
        alert('Error al subir la foto')
      }

      if (result.status) {
        console.log(result.data)
        alert('Foto subida con éxito')
        window.location.reload()
      }
    } catch (error: unknown) {
      console.log((error as Error).message)
    }
  }

  const handleUpdateChanges = async () => {
    try {
      const data = await fetch(`/api/users/${dni}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        },
        body: JSON.stringify({
          firstName,
          lastName,
          cmp,
          email,
          phone,
          birthDate
        })
      })

      const result: BaseApi = await data.json()

      if (!result.status) {
        alert('Error al actualizar los datos')
      }

      if (result.status) {
        alert('Datos actualizados con éxito')
      }

      if (preview) {
        handleUploadPhoto()
      }
    } catch (error: unknown) {
      console.log((error as Error).message)
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
      <Header />
      <main className={styles.main}>
        <Navigation />
        <Panel>
          <h1 className={`${rubik.className} ${styles.title}`}>Mi cuenta</h1>
          <div className={styles.settings}>
            <div
              className={`${styles.dragAndDropArea} ${preview && styles.withImage}`}
              style={{
                backgroundImage: `url(${preview})`,
                backgroundPosition: 'center',
                backgroundSize: 'cover'
              }}
            >
              {!preview && (
                <>
                  <FontAwesomeIcon icon={faImage} width={20} />
                  <input
                    type='file'
                    name='image'
                    accept='image/*'
                    onChange={handleFileChange}
                  />
                  <p>Arrastra y suelta tu foto de perfil aquí</p>
                </>
              )}
              {preview && (
                <button
                  className={styles.removeImageButton}
                  onClick={handleRemoveImage}
                >
                  Remover Imagen
                </button>
              )}
            </div>
            <div className={styles.account}>
              <div>
                <div className={styles.rowInput}>
                  <label htmlFor='firstName'>Nombres</label>
                  <Input
                    placeholder={''}
                    type='text'
                    onChange={(e) => setFirstName(e.target.value)}
                    value={firstName || currentUser?.firstName}
                  />
                </div>
                {currentUser?.profile === ROLES_TYPES.DOCTOR && (
                  <div className={styles.rowInput}>
                    <label htmlFor='cmp'>CMP</label>
                    <Input
                      placeholder={''}
                      type='text'
                      onChange={(e) => setCmp(e.target.value)}
                      value={cmp || ''}
                    />
                  </div>
                )}
                <div className={styles.rowInput}>
                  <label htmlFor='phone'>Teléfono</label>
                  <Input
                    placeholder={''}
                    type='text'
                    onChange={(e) => setPhone(e.target.value)}
                    value={phone || ''}
                  />
                </div>
              </div>
              <div>
                <div className={styles.rowInput}>
                  <label htmlFor='lastName'>Apellidos</label>
                  <Input
                    placeholder={''}
                    type='text'
                    onChange={(e) => setLastName(e.target.value)}
                    value={lastName || currentUser?.lastName}
                  />
                </div>
                <div className={styles.rowInput}>
                  <label htmlFor='email'>Correo</label>
                  <Input
                    placeholder={''}
                    type='text'
                    onChange={(e) => setEmail(e.target.value)}
                    value={email || currentUser?.email}
                  />
                </div>
                <div className={styles.rowInput}>
                  <label htmlFor='birthDate'>Fecha de Nacimiento</label>
                  <Input
                    placeholder={''}
                    type='date'
                    onChange={(e) => setBirthDate(e.target.value)}
                    value={birthDate || ''}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className={styles.footer}>
            <p>
              <a
                href='#javascript'
                onClick={handleLogout}
                className={styles.logout}
              >
                <FontAwesomeIcon icon={faLock} width={20} /> Cerrar sesión
              </a>
            </p>
            <Button label='Actualizar cambios' onClick={handleUpdateChanges} />
          </div>
        </Panel>
      </main>
    </>
  )
}
