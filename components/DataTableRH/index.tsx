'use client'
import React, { useState } from 'react'
import { Slide, toast } from 'react-toastify'
import moment from 'moment'
import * as XLSX from 'xlsx-js-style'
import { saveAs } from 'file-saver'
import { AppDispatch } from '@/redux/store'
import { Roboto, Rubik } from 'next/font/google'
import { formatFullName } from '@/shared/utils'
import { faFile, faFilePdf, faUserAlt } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { BaseApi } from '@/models/base'
import styles from './data-table-rh.module.css'
import Button from '../Button'
import { useDispatch } from 'react-redux'
import { toggleLoading } from '@/redux/features/global.slice'
import { openBase64InNewWindow } from '@/shared/base64'

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

const DataTableRH: React.FC<DataTableProps> = (props) => {
  const dispatch = useDispatch<AppDispatch>()

  const [selecteds, setSelecteds] = useState<string[]>([])
  const [selectAll, setSelectAll] = useState(false)

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

  const downloadAptitud = async () => {
    if (!props.startDate || !props.endDate) {
      alert('Debe seleccionar un rango de fechas')
      return
    }

    dispatch(toggleLoading())

    let url = `/api/sabana/aptitud?startDate=${props.startDate}&endDate=${props.endDate}`

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
      alert('No se logró descargar el archivo de aptitud médica')
      return
    }

    if (!result.status) {
      alert('No se logró descargar el archivo de aptitud médica')
      return
    }

    if (result.status) {
      const workbook = XLSX.utils.book_new()
      const worksheet = XLSX.utils.json_to_sheet(result.data.aptitudes)

      // const range = XLSX.utils.decode_range('A1:GF1')

      // for (let C = range.s.c; C <= range.e.c; ++C) {
      //   const cell_address = { c: C, r: range.s.r } // Dirección de la celda
      //   const cell_ref = XLSX.utils.encode_cell(cell_address) // Referencia de la celda
      //   worksheet[cell_ref].s = { // Aplicar estilo a la celda
      //     fill: { fgColor: { rgb: '2662F0' } }, // Color de fondo negro
      //     font: { color: { rgb: 'FFFFFF' } } // Color del texto blanco
      //   }
      // }

      XLSX.utils.book_append_sheet(
        workbook,
        worksheet,
        `aptitudes_${props.startDate}_${props.endDate}`
      )

      const excelBuffer = XLSX.write(workbook, {
        bookType: 'xlsx',
        type: 'array'
      })
      const dataExcel = new Blob([excelBuffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
      })

      dispatch(toggleLoading())

      saveAs(dataExcel, `aptitudes_${props.startDate}_${props.endDate}.xlsx`)
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

  return (
    <>
      {props.data.length > 0 && (
        <div className={styles.container}>
          <div className={styles.header}>
            <div>
              <input
                id={'selectAll'}
                type='checkbox'
                checked={selectAll}
                onChange={handleSelectAll}
              />
            </div>
            <div>
              <FontAwesomeIcon icon={faUserAlt} /> Nombres y Apellidos
            </div>
            <div>
              <FontAwesomeIcon icon={faFile} /> Aptitud
            </div>
            <div>
              <FontAwesomeIcon icon={faFile} /> Certificado
            </div>
            {/* <div>Detalle</div> */}
          </div>
          <div className={styles.body}>
            {props.data
              .filter((item) => item.close_status === 1)
              .map((item, index) => (
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
                <div className={styles.status}>
                  <p>{item.aptitud || '-'}</p>
                </div>
                <div className={styles.description}>
                  <FontAwesomeIcon
                    icon={faFilePdf}
                    width={'28px'}
                    onClick={() => downloadCertificadoFile(item.cdg_fmed)}
                  />
                </div>
                {/* <div className={styles.dataTableItemActions}>
                  <Button key={index} label='Ver más' onClick={() => showDetailView(`${item.cdg_fmed}`)} />
                </div> */}
              </div>
            ))}
          </div>
          <div className={styles.dataTableFooter}>
            <Button
              label='DESCARGA MASIVA CERTIFICADO'
              onClick={handleDownloadCertificados}
            />
            <Button
              label={'DESCARGAR DE APTITUD EN EXCEL'}
              onClick={() => downloadAptitud()}
            />
          </div>
        </div>
      )}
    </>
  )
}

export default DataTableRH
