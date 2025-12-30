'use client'
import 'moment/locale/es'
import moment from 'moment'
import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useRouter } from 'next/navigation'
import { Bounce, ToastContainer, toast } from 'react-toastify'
import Header from '@/components/Header'
import Navigation from '@/components/Navigation'
import Panel from '@/components/Panel'
import Select from '@/components/Select'
import Input from '@/components/Input'
import Button from '@/components/Button'
import DataTable from '@/components/DataTable'
import styles from './page.module.css'
import { BaseApi } from '@/models/base'
import { MedicalExams } from '@/models/medical-exams'
import { AppDispatch, useAppSelector } from '@/redux/store'
import DetailExams from '@/components/DetailExams'
import { toggleLoading } from '@/redux/features/global.slice'
import Welcome from '@/components/Welcome'
import MedicalHistory from '@/components/MedicalHistory'
import {
  EXAMS_TYPES_OPTIONS,
  HEADQUARTERS_OPTIONS,
  ROLES_TYPES,
} from '@/shared/constants'
import DataTablePatient from '@/components/DataTablePatient'
import DataTableRH from '@/components/DataTableRH'
import { Rubik } from 'next/font/google'
import Interconsultas from '@/components/Interconsultas'
import Recomendaciones from '@/components/Recomendaciones'
import 'react-toastify/dist/ReactToastify.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBell, faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons'
import useAccessToken from '@/hooks/useAccessToken'

const rubik = Rubik({ weight: '500', subsets: ['latin'] })

export default function HomePage() {
  const router = useRouter()
  const dispatch = useDispatch<AppDispatch>()
  const { currentUser } = useAppSelector((state) => state.authReducer)
  const accessToken = useAccessToken()
  
  const [fullName, setFullName] = useState<string>('')
  const [dni, setDni] = useState<string>('')
  const [examType, setExamType] = useState<string>('')
  const [sede, setSede] = useState<string>('')
  const [startDate, setStartDate] = useState<string>('')
  const [endDate, setEndDate] = useState<string>('')
  const [medicalExams, setMedicalExams] = useState<MedicalExams[]>([])
  const [isEmpty, setIsEmpty] = useState<boolean>()

  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(20)

  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = medicalExams.slice(indexOfFirstItem, indexOfLastItem)

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber)

  const showWelcome = useAppSelector(
    (state) => state.globalReducer.showWelcome
  )
  const showViewDetail = useAppSelector(
    (state) => state.medicalExamsReducer.showDetail
  )
  const showMedicalHistory = useAppSelector(
    (state) => state.medicalExamsReducer.showMedicalHistory
  )
  const showInterconsultas = useAppSelector(
    (state) => state.medicalExamsReducer.showInterconsultas
  )
  const showRecomendaciones = useAppSelector(
    (state) => state.medicalExamsReducer.showRecomendaciones
  )

  const handleSubmit = async () => {
    dispatch(toggleLoading())

    const queryParams = new URLSearchParams()

    const fields = [dni, fullName, examType, sede, startDate, endDate]

    if (fields.every((field) => field === '' || field === null)) {
      dispatch(toggleLoading())
      // alert('Debe ingresar al menos un filtro para realizar la búsqueda.')
      toast.warn('Debes seleccionar un rango de fechas.', {
        position: 'top-center',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'light',
        transition: Bounce,
      })
      return
    }

    if (dni) {
      queryParams.append('dni', dni)
    }

    if (fullName) {
      queryParams.append('lastName', fullName)
    }

    if (examType) {
      queryParams.append('examType', examType)
    }

    if (sede) {
      queryParams.append('sede', sede)
    }

    if (startDate && endDate) {

      queryParams.append('startDate', startDate)
      queryParams.append('endDate', endDate)
    }

    const url = `${
      process.env.API_BASE_PATH
    }/medical-exams?${queryParams.toString()}`

    const data = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        'Content-Type': 'application/json',
      },
    })

    const result: BaseApi = await data.json()

    if (result.error) {
      localStorage.removeItem('accessToken')
      router.push('/auth')
    }

    if (!result.status) {
      // alert('Ocurrió un error al obtener los datos.')
    }

    if (result.status) {
      dispatch(toggleLoading())
      setMedicalExams(result.data)

      if (result.data.length === 0) {
        setIsEmpty(true)
      } else {
        setIsEmpty(false)
      }
    }
  }

  const clearFilters = () => {
    window.location.reload()

    // setFullName('')
    // setDni('')
    // setExamType('')
    // setSede('')
    // setStartDate('')
    // setEndDate('')
  }

  const renderPageNumbers = () => {
    const totalPages = Math.ceil(medicalExams.length / itemsPerPage)
    const pageNumbers = []
  
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i)
      }
    } else {
      pageNumbers.push(1, 2, 3)
  
      if (currentPage > 3 && currentPage < totalPages - 2) {
        pageNumbers.push('...')
        pageNumbers.push(currentPage)
        pageNumbers.push('...')
      } else if (currentPage >= totalPages - 2) {
        pageNumbers.push('...')
        pageNumbers.push(totalPages - 2, totalPages - 1)
      } else {
        pageNumbers.push('...')
      }
  
      pageNumbers.push(totalPages)
    }
  
    return pageNumbers.map((number, index) => (
      <li key={index} className={currentPage === number ? styles.active : ''}>
        {typeof number === 'string' ? (
          <span className={rubik.className}>{number}</span>
        ) : (
          <button className={rubik.className} onClick={() => paginate(number)}>{number}</button>
        )}
      </li>
    ))
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
      <ToastContainer />
      <main className={styles.main}>
        <Navigation />
        <section className={styles.wrapper}>
          {showWelcome && (
            <Panel>
              <Welcome />
            </Panel>
          )}
          {showMedicalHistory && <MedicalHistory />}
          {showInterconsultas && <Interconsultas />}
          {showRecomendaciones && <Recomendaciones />}
          {showViewDetail &&
            !showMedicalHistory &&
            !showInterconsultas &&
            !showRecomendaciones && (
              <Panel>
                <DetailExams />
              </Panel>
            )}
          {!showWelcome && !showViewDetail && !showMedicalHistory && (
            <>
              <section className={styles.searchFilters}>
                <div className={styles.filters}>
                  {currentUser.profile === ROLES_TYPES.DOCTOR && (
                    <>
                      <Input
                        placeholder="Apellidos"
                        type="text"
                        onChange={(e) => setFullName(e?.target.value)}
                        value={fullName}
                      />
                      <Input
                        placeholder="D.N.I."
                        type="text"
                        onChange={(event) => setDni(event?.target.value)}
                        value={dni}
                      />
                      <Select
                        placeholder="Tipo de examen"
                        options={EXAMS_TYPES_OPTIONS}
                        onChange={(e) => setExamType(e.target.value)}
                      />
                      <Select
                        placeholder="Sede"
                        options={HEADQUARTERS_OPTIONS}
                        onChange={(e) => setSede(e.target.value)}
                      />
                    </>
                  )}
                  {currentUser.profile === ROLES_TYPES.RH && (
                    <>
                      <Input
                        placeholder="Nombres y Apellidos"
                        type="text"
                        onChange={(e) => setFullName(e?.target.value)}
                      />
                      <Input
                        placeholder="D.N.I."
                        type="text"
                        onChange={(event) => setDni(event?.target.value)}
                      />
                      <Select
                        placeholder="Tipo de examen"
                        options={EXAMS_TYPES_OPTIONS}
                        onChange={(e) => setExamType(e.target.value)}
                      />
                      <Select
                        placeholder="Sede"
                        options={HEADQUARTERS_OPTIONS}
                        onChange={(e) => setSede(e.target.value)}
                      />
                    </>
                  )}
                  <Input placeholder="Desde" type="date" onChange={(e) => setStartDate(e.target.value)}/>
                  <Input placeholder="Hasta" type="date" onChange={(e) => setEndDate(e.target.value)}/>
                </div>
                <div className={styles.actions}>
                  <Button label={'Buscar'} onClick={handleSubmit} />
                  <button
                    className={`${rubik.className} ${styles.clearFilters}`}
                    onClick={clearFilters}
                  >
                    Limpiar
                  </button>
                </div>
              </section>
              <Panel>
                {
                  isEmpty && (
                    <div className={styles.emptyData}>
                      <FontAwesomeIcon icon={faBell} color={'#1EE67D'} size='2x' />
                      <p className={rubik.className}>No se han encontrado <br/>resultados</p>
                    </div>
                  )
                }
                {currentUser.profile === ROLES_TYPES.DOCTOR && (
                  <DataTable
                    data={currentItems}
                    startDate={startDate} endDate={endDate} lastName={fullName} dni={dni} examType={examType} sede={sede} 
                  />
                )}
                {currentUser.profile === ROLES_TYPES.RH && (
                  <DataTableRH data={currentItems} startDate={moment(startDate).format('YYYY-MM-DD')}
                  endDate={moment(endDate).format('YYYY-MM-DD')} lastName={fullName} dni={dni} examType={examType} sede={sede} />
                )}
                {currentUser.profile === ROLES_TYPES.PATIENT && (
                  <DataTablePatient data={medicalExams} />
                )}
                <div className={styles.pagination}>
                  {medicalExams.length > itemsPerPage && (
                    <ul className={styles.pageNumbers}>
                      <li>
                        <button
                          className={rubik.className}
                          onClick={() => paginate(currentPage - 1)}
                          disabled={currentPage === 1}
                        >
                          <FontAwesomeIcon icon={faChevronLeft} />
                        </button>
                      </li>
                      {renderPageNumbers()}
                      <li>
                        <button
                          className={rubik.className}
                          onClick={() => paginate(currentPage + 1)}
                          disabled={currentPage === Math.ceil(medicalExams.length / itemsPerPage)}
                        >
                          <FontAwesomeIcon icon={faChevronRight} />
                        </button>
                      </li>
                    </ul>
                  )}
                </div>
                {/* <div className={styles.pagination}>
                  {medicalExams.length > itemsPerPage && (
                    <ul className={styles.pageNumbers}>
                      {Array.from({ length: Math.ceil(medicalExams.length / itemsPerPage) }).map((_, index) => (
                        <li key={index} className={currentPage === index + 1 ? styles.active : ''}>
                          <button className={rubik.className} onClick={() => paginate(index + 1)}>{index + 1}</button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div> */}
              </Panel>
            </>
          )}
        </section>
      </main>
    </>
  )
}
