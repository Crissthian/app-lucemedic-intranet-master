'use client'
import { BaseApi } from '@/models/base'
import { toggleLoading } from '@/redux/features/global.slice'
import { getDetail, toggleDetail, toggleInterconsultas } from '@/redux/features/medical-exams.slice'
import { AppDispatch } from '@/redux/store'
import { openBase64InNewWindow } from '@/shared/base64'
import { ROLES_TYPES } from '@/shared/constants'
import { formatFullName } from '@/shared/utils'
import useUserProfile from '@/hooks/useUserProfile'
import {
  faCircleInfo,
  faFile,
  faFilePdf
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { saveAs } from 'file-saver'
import moment from 'moment'
import { Roboto, Rubik } from 'next/font/google'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { Slide, ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import * as XLSX from 'xlsx-js-style'
import Button from '../Button'
import styles from './datatable.module.css'

const rubik = Rubik({ weight: '400', subsets: ['latin'] })
const roboto400 = Roboto({ weight: '400', subsets: ['latin'] })

interface DataTableProps {
  data: Array<any>
  lastName?: string
  dni?: string
  examType?: string
  sede?: string
  startDate: string
  endDate: string
}

const DataTable: React.FC<DataTableProps> = (props) => {
  const router = useRouter()
  const dispatch = useDispatch<AppDispatch>()
  const currentUser = useUserProfile()
  const isRH = currentUser?.profile === ROLES_TYPES.RH

  const [selecteds, setSelecteds] = useState<string[]>([])
  const [selectAll, setSelectAll] = useState(false)
  const [consultationsMap, setConsultationsMap] = useState<Record<string, boolean>>({})

  useEffect(() => {
    if (!props.data || props.data.length === 0) return

    const token = localStorage.getItem('accessToken')
    const closedItems = props.data.filter((item) => item.close_status === 1)

    Promise.all(
      closedItems.map(async (item) => {
        try {
          const res = await fetch(`/api/medical-exams/${item.cdg_fmed}/consultations`, {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          })
          const result: BaseApi = await res.json()
          return {
            cdg_fmed: item.cdg_fmed,
            hasConsultations:
              result.status &&
              Array.isArray(result.data?.consultations) &&
              result.data.consultations.length > 0
          }
        } catch {
          return { cdg_fmed: item.cdg_fmed, hasConsultations: false }
        }
      })
    ).then((results) => {
      const map: Record<string, boolean> = {}
      results.forEach(({ cdg_fmed, hasConsultations }) => {
        map[cdg_fmed] = hasConsultations
      })
      setConsultationsMap(map)
    })
  }, [props.data])

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
      // alert('No se pudo obtener el detalle del examen médico')
      toast.warn('No se pudo obtener el detalle del exámen médico.', {
        position: 'top-center',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'light',
        transition: Slide
      })
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

  const downloadCertificadoFile = async (cdg_fmed: string) => {
    const path = `/api/medical-exams/${cdg_fmed}/certificado`

    const response = await fetch(path, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        'Content-Type': 'application/json'
      }
    })

    const result: BaseApi = await response.json()

    if (result.error) {
      alert('No se pudo obtener el detalle del examen médico')
    }

    if (!result.status) {
      alert('No se pudo obtener el detalle del examen médico')
    }

    if (result.status) {
      openBase64InNewWindow(
        result.data.file,
        `certificado_${cdg_fmed}.pdf`,
        'application/pdf'
      )
    }
  }

  const downloadEMOFile = async (file: string) => {
    const path = `/api/medical-exams/${file}/emo`

    const response = await fetch(path, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        'Content-Type': 'application/json'
      }
    })

    const result: BaseApi = await response.json()

    if (result.error) {
      alert('No se pudo obtener el detalle del examen médico')
    }

    if (!result.status) {
      alert('No se pudo obtener el detalle del examen médico')
    }

    if (result.status) {
      openBase64InNewWindow(
        result.data.file,
        `emo_${file}.pdf`,
        'application/pdf'
      )
    }
  }

  const handleOpenInterconsultas = (item: any) => {
    dispatch(getDetail(item))
    dispatch(toggleInterconsultas())
  }

  const handleChecked = (id: string) => {
    const index = selecteds.indexOf(id)

    if (index === -1) {
      setSelecteds([...selecteds, id])
    }

    if (index !== -1) {
      const newSelecteds = selecteds.filter((item) => item !== id)

      setSelecteds(newSelecteds)
    }
  }

  const handleSelectAll = () => {
    setSelectAll(!selectAll)
    // setSelecteds(selectAll ? [] : props.data.map((item) => item.cdg_fmed))
    setSelecteds(
      selectAll
        ? []
        : props.data
            .filter((item) => item.close_status === 1)
            .map((item) => item.cdg_fmed)
    )
    // console.log(props.data.filter((item) => item.close_status === 1).length)
  }

  const downloadSabana = async () => {
    if (!props.startDate || !props.endDate) {
      // alert('Debe seleccionar un rango de fechas')
      toast.warn('Debes seleccionar un rango de fechas.', {
        position: 'top-center',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'light',
        transition: Slide
      })
      return
    }

    dispatch(toggleLoading())

    let url = `/api/sabana?startDate=${props.startDate}&endDate=${props.endDate}`

    if (props.lastName) {
      url += `&lastName=${props.lastName}`
    }

    if (props.dni) {
      url += `&dni=${props.dni}`
    }

    if (props.examType) {
      url += `&examType=${props.examType}`
    }

    if (props.sede) {
      url += `&sede=${props.sede}`
    }

    const data = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        'Content-Type': 'application/json'
      }
    })

    const result: BaseApi = await data.json()

    if (result.error) {
      alert('No se logró descargar la sábana')
      return
    }

    if (!result.status) {
      alert('No se logró descargar la sábana')
      return
    }

    if (result.status) {
      const workbook = XLSX.utils.book_new()
      const worksheet = XLSX.utils.json_to_sheet(result.data.sabana)

      const worksheetRange = worksheet['!ref'] || 'A1:A1'
      const range = XLSX.utils.decode_range(worksheetRange)

      for (let C = range.s.c; C <= range.e.c; ++C) {
        const cell_address = { c: C, r: range.s.r } // Dirección de la celda
        const cell_ref = XLSX.utils.encode_cell(cell_address) // Referencia de la celda
        if (!worksheet[cell_ref]) {
          continue
        }

        worksheet[cell_ref].s = {
          // Aplicar estilo a la celda
          fill: { fgColor: { rgb: '2662F0' } }, // Color de fondo negro
          font: { color: { rgb: 'FFFFFF' } } // Color del texto blanco
        }
      }

      XLSX.utils.book_append_sheet(
        workbook,
        worksheet,
        `sabana_${props.startDate}_${props.endDate}`
      )

      const excelBuffer = XLSX.write(workbook, {
        bookType: 'xlsx',
        type: 'array'
      })
      const dataExcel = new Blob([excelBuffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
      })

      dispatch(toggleLoading())

      saveAs(dataExcel, `sabana_${props.startDate}_${props.endDate}.xlsx`)
    }
  }

  const downloadInterconsultations = async () => {
    if (!props.startDate || !props.endDate) {
      toast.warn('Debes seleccionar un rango de fechas.', {
        position: 'top-center',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'light',
        transition: Slide
      })
      return
    }

    dispatch(toggleLoading())

    const url = `/api/sabana/interconsultations?startDate=${props.startDate}&endDate=${props.endDate}`

    const data = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        'Content-Type': 'application/json'
      }
    })

    const result: BaseApi = await data.json()

    if (result.error) {
      toast.error('No se logró descargar el resumen de interconsultas.', {
        position: 'top-center',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'light',
        transition: Slide
      })
      return
    }

    if (!result.status) {
      toast.error('No se logró descargar el resumen de interconsultas.', {
        position: 'top-center',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'light',
        transition: Slide
      })
      return
    }

    if (result.status) {
      const workbook = XLSX.utils.book_new()
      const worksheet = XLSX.utils.json_to_sheet(result.data.interconsultations)

      const worksheetRange = worksheet['!ref'] || 'A1:A1'
      const range = XLSX.utils.decode_range(worksheetRange)

      for (let C = range.s.c; C <= range.e.c; ++C) {
        const cell_address = { c: C, r: range.s.r } // Dirección de la celda
        const cell_ref = XLSX.utils.encode_cell(cell_address) // Referencia de la celda
        if (!worksheet[cell_ref]) {
          continue
        }

        worksheet[cell_ref].s = {
          // Aplicar estilo a la celda
          fill: { fgColor: { rgb: '2662F0' } }, // Color de fondo negro
          font: { color: { rgb: 'FFFFFF' } } // Color del texto blanco
        }
      }

      XLSX.utils.book_append_sheet(
        workbook,
        worksheet,
        `resumen_${props.startDate}_${props.endDate}`
      )

      const excelBuffer = XLSX.write(workbook, {
        bookType: 'xlsx',
        type: 'array'
      })
      const dataExcel = new Blob([excelBuffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
      })

      dispatch(toggleLoading())

      saveAs(dataExcel, `resumen_${props.startDate}_${props.endDate}.xlsx`)
    }
  }

  const handleDownloadCertificados = async () => {
    if (selecteds.length > 20) {
      toast.warn('Solo se puede descargar 20 archivos a la vez.', {
        position: 'top-center',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'light',
        transition: Slide
      })
      return
    }

    if (selecteds.length === 0) {
      toast.warn('Debe seleccionar al menos un archivo.', {
        position: 'top-center',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'light',
        transition: Slide
      })
      return
    }

    dispatch(toggleLoading())

    try {
      const url = '/api/attachments/downloads'

      const params = {
        type: 0,
        ids: [...selecteds]
      }

      const data = await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(params)
      })

      if (data.status !== 200) {
        dispatch(toggleLoading())
        toast.error(
          'Al parecer algo no salió bien. Contacte al administrador.',
          {
            position: 'top-center',
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: 'light',
            transition: Slide
          }
        )
        return
      }

      // blob zip file
      const blob = await data.blob()

      // create file
      const file = new File(
        [blob],
        `lucemedic_certificados_${moment().format('YYYY-MM-DD')}.zip`,
        {
          type: 'application/zip'
        }
      )

      dispatch(toggleLoading())

      saveAs(file)
    } catch {
      toast.error('Al parecer algo no salió bien. Contacte al administrador.', {
        position: 'top-center',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'light',
        transition: Slide
      })
      return
    }
  }

  const handleDownloadEMOS = async () => {
    if (selecteds.length > 20) {
      toast.warn('Solo se puede descargar 20 archivos a la vez.', {
        position: 'top-center',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'light',
        transition: Slide
      })
      return
    }

    if (selecteds.length === 0) {
      toast.warn('Debe seleccionar al menos un archivo.', {
        position: 'top-center',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'light',
        transition: Slide
      })
      return
    }

    dispatch(toggleLoading())

    try {
      const url = '/api/attachments/downloads'

      const params = {
        type: 1,
        ids: [...selecteds]
      }

      const data = await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(params)
      })

      if (data.status !== 200) {
        dispatch(toggleLoading())
        toast.error(
          'Al parecer algo no salió bien. Contacte al administrador.',
          {
            position: 'top-center',
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: 'light',
            transition: Slide
          }
        )
        return
      }

      // blob zip file
      const blob = await data.blob()

      // create file
      const file = new File(
        [blob],
        `lucemedic_emos_${moment().format('YYYY-MM-DD')}.zip`,
        {
          type: 'application/zip'
        }
      )

      dispatch(toggleLoading())

      saveAs(file)
    } catch {
      toast.error('Al parecer algo no salió bien. Contacte al administrador.', {
        position: 'top-center',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'light',
        transition: Slide
      })
      return
    }
  }

  return (
    <>
      {props.data.length > 0 && (
        <div className={styles.dataTable}>
          <ToastContainer />
          <div className={`${rubik.className} ${styles.dataTableHeader}`}>
            <div>
              <input
                id={'selectAll'}
                type='checkbox'
                checked={selectAll}
                onChange={handleSelectAll}
              />
            </div>
            <div>Nombres y Apellidos</div>
            <div>
              <FontAwesomeIcon icon={faFile} width={'10px'} /> Aptitud
            </div>
            <div>
              <FontAwesomeIcon icon={faFile} width={'10px'} /> Certificado
            </div>
            {!isRH && (
              <div>
                <FontAwesomeIcon icon={faCircleInfo} width={'10px'} /> EMO
              </div>
            )}
            {!isRH && (
              <div>
                <FontAwesomeIcon icon={faFile} width={'15px'} /> Interconsulta
              </div>
            )}
          </div>
          <div className={styles.dataTableBody}>
            {props.data.map((item, index) => (
              <div key={index} className={styles.dataTableItem}>
                <div>
                  {item.close_status === 1 && (
                    <input
                      id={`selected_${item.cdg_fmed}`}
                      key={index}
                      type='checkbox'
                      checked={selecteds.includes(item.cdg_fmed)}
                      onChange={() => handleChecked(item.cdg_fmed)}
                    />
                  )}
                </div>
                <div className={`${styles.title} ${roboto400.className}`}>
                  <p>{formatFullName(`${item.apellidos} ${item.nombres} `)}</p>
                  <p className={`${styles.subtitle} ${rubik.className}`}>
                    <span>Ficha N° {item.cdg_fmed}</span> /{' '}
                    <span>Fecha de atención: {item.fec_fmed}</span> /{' '}
                    <span>Tipo de examen: {item.t_examen}</span>
                  </p>
                </div>
                <div className={styles.columnAptitud}>{item.aptitud}</div>
                <div className={styles.columnCertificado}>
                  {item.close_status === 1 && (
                    <FontAwesomeIcon
                      icon={faFilePdf}
                      width={'28px'}
                      onClick={() => downloadCertificadoFile(item.cdg_fmed)}
                    />
                  )}
                </div>
                {!isRH && (
                  <div className={styles.columnEMO}>
                    {item.close_status === 1 && (
                      <FontAwesomeIcon
                        icon={faFilePdf}
                        width={'28px'}
                        onClick={() => downloadEMOFile(item.cdg_fmed)}
                      />
                    )}
                  </div>
                )}
                {!isRH && (
                  <div className={styles.columnInterconsulta}>
                    {item.close_status === 1 ? (
                      consultationsMap[item.cdg_fmed] ? (
                        <FontAwesomeIcon
                          icon={faFilePdf}
                          width={'28px'}
                          onClick={() => handleOpenInterconsultas(item)}
                        />
                      ) : (
                        <span className={styles.noInterconsulta}>—</span>
                      )
                    ) : null}
                  </div>
                )}
                {!isRH && (
                  <div className={styles.dataTableItemActions}>
                    <Button
                      key={index}
                      label='Ver más'
                      onClick={() => showDetailView(`${item.cdg_fmed}`)}
                      width='100px'
                      disabled={item.chkproceso}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className={styles.dataTableFooter}>
            {!isRH && (
              <Button
                label='DESCARGA MASIVA E.M.O.'
                onClick={handleDownloadEMOS}
              />
            )}
            <Button
              label='DESCARGA MASIVA CERTIFICADO'
              onClick={handleDownloadCertificados}
            />
            {!isRH && (
              <Button
                label={'DESCARGAR SABANA EXCEL'}
                onClick={() => downloadSabana()}
              />
            )}
            {!isRH && (
              <Button
                label={'DESCARGAR RESUMEN DE INTERCONSULTAS'}
                onClick={() => downloadInterconsultations()}
              />
            )}
          </div>
          <div className={styles.totalRows}>
            {selecteds.length > 0 && (
              <p className={rubik.className}>
                Total seleccionados: <b>{selecteds.length} registros</b>
              </p>
            )}
          </div>
        </div>
      )}
    </>
  )
}

export default DataTable
