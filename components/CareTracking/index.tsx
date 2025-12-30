'use client'
import { useEffect, useState } from 'react'
import Button from '../Button'
import Input from '../Input'
import Panel from '../Panel'
import Select from '../Select'
import TableTracking from '../TableTracking'
import styles from './care-tracking.module.css'
import { AttentionMonitoring } from '@/models/attention-monitoring'
import { BaseApi } from '@/models/base'
import { Rubik } from 'next/font/google'
import { HEADQUARTERS_OPTIONS } from '@/shared/constants'
import { toggleLoading } from '@/redux/features/global.slice'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '@/redux/store'
import EmtpyData from '../EmptyData'

const rubik = Rubik({ weight: '500', subsets: ['latin'] })

const CareTracking: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()

  const [sede, setSede] = useState<string>('')
  const [startDate, setStartDate] = useState<string>('')
  const [endDate, setEndDate] = useState<string>('')
  const [attentionMonitoring, setAttentionMonitoring] = useState<
    AttentionMonitoring[]
  >([])

  const handleSearch = async () => {
    if (!startDate || !endDate) {
      alert('Debe ingresar una fecha de inicio y fin')
      return
    }

    dispatch(toggleLoading())

    let path = `${process.env.API_BASE_PATH}/attention-monitoring?startDate=${startDate}&endDate=${endDate}`

    if (sede) {
      path = `${path}&headquarter=${sede}`
    }

    const response = await fetch(path, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        'Content-Type': 'application/json',
      },
    })

    const result: BaseApi = await response.json()

    if (result.error) {
      alert('No se pudo obtener el seguimiento de atención')
    }

    if (!result.status) {
      alert('No se pudo obtener el seguimiento de atención')
    }

    setAttentionMonitoring(result.data.attention_monitoring)
    dispatch(toggleLoading())
  }

  const clearFilters = () => {
    setStartDate('')
    setEndDate('')
  }

  useEffect(() => {
    const getAttentionMonitoring = async () => {
      dispatch(toggleLoading())

      const currentDate = new Date().toISOString().split('T')[0]

      let path = `${process.env.API_BASE_PATH}/attention-monitoring?startDate=${currentDate}&endDate=${currentDate}&headquarter=001`

      const response = await fetch(path, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          'Content-Type': 'application/json',
        },
      })

      const result: BaseApi = await response.json()

      if (result.error) {
        alert('No se pudo obtener el seguimiento de atención')
      }

      if (!result.status) {
        alert('No se pudo obtener el seguimiento de atención')
      }

      setAttentionMonitoring(result.data.attention_monitoring)
      dispatch(toggleLoading())
    }

    getAttentionMonitoring()
  }, [dispatch])

  return (
    <div className={styles.main}>
      <section className={styles.searchFilters}>
        <div className={styles.filters}>
          <Select
            placeholder="Sede"
            options={HEADQUARTERS_OPTIONS}
            onChange={(e) => setSede(e.target.value)}
          />
          <Input
            placeholder={'Desde:'}
            type={'date'}
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <Input
            placeholder={'Hasta:'}
            type={'date'}
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
        <div className={styles.actions}>
          <Button label={'Buscar'} onClick={() => handleSearch()} />
          <button
            className={`${rubik.className} ${styles.clearFilters}`}
            onClick={() => clearFilters()}
          >
            Limpiar
          </button>
        </div>
      </section>
      {
        attentionMonitoring.length === 0 && (
          <Panel>
            <EmtpyData />
          </Panel>
        )
      }
      {
        attentionMonitoring.length > 0 && (
          <Panel>
            <TableTracking data={attentionMonitoring} />
          </Panel>
        )
      }
    </div>
  )
}

export default CareTracking
