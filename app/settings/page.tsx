'use client'
import { useState } from 'react'
import styles from './settings.module.css'
import Panel from '@/components/Panel'
import { Rubik } from 'next/font/google'
import Input from '@/components/Input'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faImage, faLock } from '@fortawesome/free-solid-svg-icons'
import Button from '@/components/Button'
import { BaseApi } from '@/models/base'
import { ROLES_TYPES } from '@/shared/constants'
import useUserProfile from '@/hooks/useUserProfile'
import useAuthPhoto from '@/hooks/useAuthPhoto'

const rubik = Rubik({ weight: '600', subsets: ['latin'] })

export default function Settings() {
  const currentUser = useUserProfile()
  const [dni] = useState<string>(currentUser?.dni || '')
  const [firstName, setFirstName] = useState<string>(currentUser?.firstName || '')
  const [lastName, setLastName] = useState<string>(currentUser?.lastName || '')
  const [cmp, setCmp] = useState<string>(currentUser?.cmp || '')
  const [email, setEmail] = useState<string>(currentUser?.email || '')
  const [phone, setPhone] = useState<string>(currentUser?.phone || '')
  const [birthDate, setBirthDate] = useState<string>(currentUser?.birthDate || '')
  const [selectedFile, setSelectedFile] = useState<File | undefined>()
  const [preview, setPreview] = useState<string | ArrayBuffer | null>(null)
  const [photoUrl, setPhotoUrl] = useState<string | null>(
    currentUser?.photoUrl || null
  )
  const remotePhoto = useAuthPhoto(photoUrl)

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
    setSelectedFile(undefined)
    setPhotoUrl(null)
  }

  const handleLogout = () => {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('profileLogged')
    window.location.reload()
  }

  const handleDeletePhoto = async (photoIdToDelete: string) => {
    try {
      const response = await fetch(
        `/api/commons/users/photo/${photoIdToDelete}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`
          }
        }
      )

      const result: BaseApi = await response.json()

      if (!result.status) {
        console.error('Error al eliminar la foto anterior')
      }

      return result.status
    } catch (error: unknown) {
      console.error(
        'Error al eliminar la foto anterior:',
        (error as Error).message
      )
      return false
    }
  }

  const handleUploadPhoto = async (oldPhotoUrl: string | null) => {
    try {
      // Delete the old photo from FTP server if it exists
      if (oldPhotoUrl) {
        await handleDeletePhoto(oldPhotoUrl)
      }

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
        // Update photoUrl in localStorage
        const profile = localStorage.getItem('profileLogged')
        if (profile && result.data?.file?.fileName) {
          try {
            const parsedProfile = JSON.parse(profile)
            parsedProfile.photo_url = result.data.file.fileName
            localStorage.setItem('profileLogged', JSON.stringify(parsedProfile))
          } catch (e) {
            console.error('Error updating photo in localStorage:', e)
          }
        }
        alert('Foto subida con éxito')
        window.location.reload()
      }
    } catch (error: unknown) {
      console.log((error as Error).message)
    }
  }

  const handleUpdateChanges = async () => {
    try {
      // Only send fields that exist in the DB table
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
          email
        })
      })

      const result: BaseApi = await data.json()

      if (!result.status) {
        alert('Error al actualizar los datos')
      }

      if (result.status) {
        // Save phone and birthDate to localStorage (not in DB table)
        const profile = localStorage.getItem('profileLogged')
        if (profile) {
          try {
            const parsedProfile = JSON.parse(profile)
            parsedProfile.first_name = firstName
            parsedProfile.last_name = lastName
            parsedProfile.email = email
            parsedProfile.cmp = cmp
            parsedProfile.phone = phone
            parsedProfile.birth_date = birthDate
            localStorage.setItem('profileLogged', JSON.stringify(parsedProfile))
          } catch (e) {
            console.error('Error updating localStorage:', e)
          }
        }
        alert('Datos actualizados con éxito')
      }

      // If there's a new photo selected, upload it (and delete the old one)
      if (preview && selectedFile) {
        await handleUploadPhoto(photoUrl)
      }
    } catch (error: unknown) {
      console.log((error as Error).message)
    }
  }

  return (
    <Panel>
      <h1 className={`${rubik.className} ${styles.title}`}>Mi cuenta</h1>
      <div className={styles.settings}>
        <div
          className={`${styles.dragAndDropArea} ${(preview || photoUrl) && styles.withImage}`}
          style={{
            backgroundImage: preview
              ? `url(${preview})`
              : remotePhoto
                ? `url(${remotePhoto})`
                : 'none',
            backgroundPosition: 'center',
            backgroundSize: 'cover'
          }}
        >
          {!preview && !photoUrl && (
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
          {(preview || photoUrl) && (
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
          <a href='#javascript' onClick={handleLogout} className={styles.logout}>
            <FontAwesomeIcon icon={faLock} width={20} /> Cerrar sesión
          </a>
        </p>
        <Button label='Actualizar cambios' onClick={handleUpdateChanges} />
      </div>
    </Panel>
  )
}
