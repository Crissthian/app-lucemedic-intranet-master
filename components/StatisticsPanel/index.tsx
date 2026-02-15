'use client'
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { toggleLoading } from '@/redux/features/global.slice'
import { AppDispatch } from '@/redux/store'
import styles from './statistics-panel.module.css'
import Select from '../Select'
import { EXAMS_TYPES_OPTIONS, HEADQUARTERS_OPTIONS } from '@/shared/constants'
import Input from '../Input'
import Button from '../Button'
import { Rubik } from 'next/font/google'
import Panel from '../Panel'
import PanelIcon from '../PanelIcon'
import {
  Genders,
  Ages,
  MedicalFitness,
  BloodPressure,
  OsteoMuscularPathologies,
  LaboratoryExams,
  Spirometry,
  Audiometry,
  VisualAcuity,
  OtherConditions,
  ChestXRay,
  Electrocardiogram,
  Psychology,
  Odontology,
  StructuralHeight
} from '@/models/statistics'
import StatisticsGenders from '../StatisticsGenders'
import { BaseApi } from '@/models/base'
import StatisticsIMC from '../StatisticsIMC'
import { NutritionalProfile } from '@/models/nutritional-profile'
import StatisticsOsteoMuscularPathologies from '../StatisticsPatologies'
import StatisticsLaboratoryExams from '../StatisticsLaboratoryExams'
import StatisticsAudiometry from '../StatisticsAudiometry'
import StatisticsSpirometry from '../StatisticsSpirometry'
import StatisticsOtherConditions from '../StatisticsOtherConditions'

import StatisticsOdontology from '../StatisticsOdontology'
import ChartMultipleBars from '../ChartMultipleBars'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBell } from '@fortawesome/free-solid-svg-icons'
import StatisticsChestXRay from '../StatisticsChestXRay'

const rubik = Rubik({ weight: '500', subsets: ['latin'] })

const StatisticsPanel: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()

  const [sede, setSede] = useState<string>('')
  const [examType, setExamType] = useState<string>('')
  const [startDate, setStartDate] = useState<string>('')
  const [endDate, setEndDate] = useState<string>('')

  const [genders, setGenders] = useState<Genders>({
    masculino: '',
    femenino: ''
  })
  const [ages, setAges] = useState<Ages[]>([])
  const [medicalFitness, setMedicalFitness] = useState<MedicalFitness[]>([])
  const [nutritionalProfile, setNutritionalProfile] = useState<
    NutritionalProfile[]
  >([])
  const [bloodPressureData, setBloodPressureData] = useState<BloodPressure[]>(
    []
  )
  const [osteoMuscularPathologies, setOsteoMuscularPathologies] = useState<
    OsteoMuscularPathologies[]
  >([])
  const [laboratoryExams, setLaboratoryExams] = useState<LaboratoryExams[]>([])
  const [audiometry, setAudiometry] = useState<Audiometry[]>([])
  const [spirometry, setSpirometry] = useState<Spirometry[]>([])
  const [visualAcuity, setVisualAcuity] = useState<VisualAcuity[]>([])
  const [otherConditions, setOtherConditions] = useState<OtherConditions[]>([])
  const [chestXRay, setChestXRay] = useState<ChestXRay[]>([])
  const [electrocardiogram, setElectrocardiogram] = useState<
    Electrocardiogram[]
  >([])
  const [psychology, setPsychology] = useState<Psychology[]>([])
  const [odontology, setOdontology] = useState<Odontology[]>([])
  const [structuralHeight, setStructuralHeight] = useState<StructuralHeight[]>(
    []
  )
  const [emptyData, setEmptyData] = useState<boolean>(false)

  const getGenders = async () => {
    let url = `/api/statistics/genders?startDate=${startDate}&endDate=${endDate}`

    if (examType) {
      url += `&examType=${examType}`
    }

    if (sede) {
      url += `&headquarter=${sede}`
    }

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        'Content-Type': 'application/json'
      }
    })

    const result: BaseApi = await response.json()

    if (result.error) {
      console.log('Error al obtener los datos estadísticos')
    }

    if (result.status) {
      setGenders(result.data.genders)
    }
  }

  const getAges = async () => {
    let url = `/api/statistics/ages?startDate=${startDate}&endDate=${endDate}`

    if (examType) {
      url += `&examType=${examType}`
    }

    if (sede) {
      url += `&headquarter=${sede}`
    }

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        'Content-Type': 'application/json'
      }
    })

    const result: BaseApi = await response.json()

    if (result.error) {
      console.log('Error al obtener los datos estadísticos')
    }

    if (result.status) {
      setAges(result.data.ages)
    }
  }

  const getMedicalFitness = async () => {
    let url = `/api/statistics/medical-fitness?startDate=${startDate}&endDate=${endDate}`

    if (examType) {
      url += `&examType=${examType}`
    }

    if (sede) {
      url += `&headquarter=${sede}`
    }

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        'Content-Type': 'application/json'
      }
    })

    const result: BaseApi = await response.json()

    if (result.error) {
      console.log('Error al obtener los datos estadísticos')
    }

    if (result.status) {
      setMedicalFitness(result.data.medical_fitness)
    }
  }

  const getNutritionalProfile = async () => {
    let url = `/api/statistics/nutritional-profile?startDate=${startDate}&endDate=${endDate}`

    if (examType) {
      url += `&examType=${examType}`
    }

    if (sede) {
      url += `&headquarter=${sede}`
    }

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        'Content-Type': 'application/json'
      }
    })

    const result: BaseApi = await response.json()

    if (result.status) {
      setNutritionalProfile(result.data.nutritional_profile)
    }
  }

  const getBloodPressure = async () => {
    let url = `/api/statistics/blood-pressure?startDate=${startDate}&endDate=${endDate}`

    if (examType) {
      url += `&examType=${examType}`
    }

    if (sede) {
      url += `&headquarter=${sede}`
    }

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        'Content-Type': 'application/json'
      }
    })

    const result: BaseApi = await response.json()

    if (result.error) {
      console.log('Error al obtener los datos estadísticos')
    }

    if (result.status) {
      setBloodPressureData(result.data.blood_pressure)
    }
  }

  const getOsteoMuscularPathologies = async () => {
    let url = `/api/statistics/osteo-muscular-pathologies?startDate=${startDate}&endDate=${endDate}`

    if (examType) {
      url += `&examType=${examType}`
    }

    if (sede) {
      url += `&headquarter=${sede}`
    }

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        'Content-Type': 'application/json'
      }
    })

    const result: BaseApi = await response.json()

    if (result.error) {
      console.log('Error al obtener los datos estadísticos')
    }

    if (result.status) {
      setOsteoMuscularPathologies(result.data.osteo_muscular_pathologies)
    }
  }

  const getLaboratoryExams = async () => {
    let url = `/api/statistics/exams?startDate=${startDate}&endDate=${endDate}`

    if (examType) {
      url += `&examType=${examType}`
    }

    if (sede) {
      url += `&headquarter=${sede}`
    }

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        'Content-Type': 'application/json'
      }
    })

    const result: BaseApi = await response.json()

    if (result.error) {
      console.log('Error al obtener los datos estadísticos')
    }

    if (result.status) {
      setLaboratoryExams(result.data.exams)
    }
  }

  const getAudiometry = async () => {
    let url = `/api/statistics/audiometry?startDate=${startDate}&endDate=${endDate}`

    if (examType) {
      url += `&examType=${examType}`
    }

    if (sede) {
      url += `&headquarter=${sede}`
    }

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        'Content-Type': 'application/json'
      }
    })

    const result: BaseApi = await response.json()

    if (result.error) {
      console.log('Error al obtener los datos estadísticos')
    }

    if (result.status) {
      setAudiometry(result.data.audiometry)
    }
  }

  const getSpirometry = async () => {
    let url = `/api/statistics/spirometry?startDate=${startDate}&endDate=${endDate}`

    if (examType) {
      url += `&examType=${examType}`
    }

    if (sede) {
      url += `&headquarter=${sede}`
    }

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        'Content-Type': 'application/json'
      }
    })

    const result: BaseApi = await response.json()

    if (result.error) {
      console.log('Error al obtener los datos estadísticos')
    }

    if (result.status) {
      setSpirometry(result.data.spirometry)
    }
  }

  const getVisualAcuity = async () => {
    let url = `/api/statistics/visual-acuity?startDate=${startDate}&endDate=${endDate}`

    if (examType) {
      url += `&examType=${examType}`
    }

    if (sede) {
      url += `&headquarter=${sede}`
    }

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        'Content-Type': 'application/json'
      }
    })

    const result: BaseApi = await response.json()

    if (result.error) {
      console.log('Error al obtener los datos estadísticos')
    }

    if (result.status) {
      setVisualAcuity(result.data.visual_acuity)
    }
  }

  const getOtherConditions = async () => {
    let url = `/api/statistics/other-conditions?startDate=${startDate}&endDate=${endDate}`

    if (examType) {
      url += `&examType=${examType}`
    }

    if (sede) {
      url += `&headquarter=${sede}`
    }

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        'Content-Type': 'application/json'
      }
    })

    const result: BaseApi = await response.json()

    if (result.error) {
      console.log('Error al obtener los datos estadísticos')
    }

    if (result.status) {
      setOtherConditions(result.data.other_conditions)
    }
  }

  const getChestXRay = async () => {
    let url = `/api/statistics/chest-x-ray?startDate=${startDate}&endDate=${endDate}`

    if (examType) {
      url += `&examType=${examType}`
    }

    if (sede) {
      url += `&headquarter=${sede}`
    }

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        'Content-Type': 'application/json'
      }
    })

    const result: BaseApi = await response.json()

    if (result.error) {
      console.log('Error al obtener los datos estadísticos')
    }

    if (result.status) {
      setChestXRay(result.data.chest_x_ray)
    }
  }

  const getElectrocardiogram = async () => {
    let url = `/api/statistics/electrocardiogram?startDate=${startDate}&endDate=${endDate}`

    if (examType) {
      url += `&examType=${examType}`
    }

    if (sede) {
      url += `&headquarter=${sede}`
    }

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        'Content-Type': 'application/json'
      }
    })

    const result: BaseApi = await response.json()

    if (result.error) {
      console.log('Error al obtener los datos estadísticos')
    }

    if (result.status) {
      setElectrocardiogram(result.data.electrocardiogram)
    }
  }

  const getPsychology = async () => {
    let url = `/api/statistics/psychology?startDate=${startDate}&endDate=${endDate}`

    if (examType) {
      url += `&examType=${examType}`
    }

    if (sede) {
      url += `&headquarter=${sede}`
    }

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        'Content-Type': 'application/json'
      }
    })

    const result: BaseApi = await response.json()

    if (result.error) {
      console.log('Error al obtener los datos estadísticos')
    }

    if (result.status) {
      setPsychology(result.data.psychology)
    }
  }

  const getOdontology = async () => {
    let url = `/api/statistics/odontology?startDate=${startDate}&endDate=${endDate}`

    if (examType) {
      url += `&examType=${examType}`
    }

    if (sede) {
      url += `&headquarter=${sede}`
    }

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        'Content-Type': 'application/json'
      }
    })

    const result: BaseApi = await response.json()

    if (result.error) {
      console.log('Error al obtener los datos estadísticos')
    }

    if (result.status) {
      setOdontology(result.data.odontology)
    }
  }

  const getStructuralHeight = async () => {
    let url = `/api/statistics/structural-height?startDate=${startDate}&endDate=${endDate}`

    if (examType) {
      url += `&examType=${examType}`
    }

    if (sede) {
      url += `&headquarter=${sede}`
    }

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        'Content-Type': 'application/json'
      }
    })

    const result: BaseApi = await response.json()

    if (result.error) {
      console.log('Error al obtener los datos estadísticos')
    }

    if (result.status) {
      setStructuralHeight(result.data.structural_height)
    }
  }

  const handleSearch = async () => {
    dispatch(toggleLoading())

    let url = `/api/statistics/check?startDate=${startDate}&endDate=${endDate}`

    if (examType) {
      url += `&examType=${examType}`
    }

    if (sede) {
      url += `&headquarter=${sede}`
    }

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        'Content-Type': 'application/json'
      }
    })

    const result: BaseApi = await response.json()

    if (result.error) {
      console.log('Error al obtener los datos estadísticos')
    }

    if (result.status && result.data.check) {
      setEmptyData(!result.data.check)
      await Promise.all([
        getGenders(),
        getAges(),
        getMedicalFitness(),
        getNutritionalProfile(),
        getBloodPressure(),
        getOsteoMuscularPathologies(),
        getLaboratoryExams(),
        getAudiometry(),
        getSpirometry(),
        getVisualAcuity(),
        getOtherConditions(),
        getChestXRay(),
        getElectrocardiogram(),
        getPsychology(),
        getOdontology(),
        getStructuralHeight()
      ])
    }

    if (result.status && !result.data.check) {
      setEmptyData(!result.data.check)
      dispatch(toggleLoading())
      return
    }

    dispatch(toggleLoading())
  }

  const clearFilters = () => {
    setStartDate('')
    setEndDate('')
  }

  return (
    <>
      <div className={styles.main}>
        <section className={styles.searchFilters}>
          <div className={styles.filters}>
            <Select
              placeholder='Sede'
              options={HEADQUARTERS_OPTIONS}
              onChange={(e) => setSede(e.target.value)}
            />
            <Select
              placeholder='Tipo de examen'
              options={EXAMS_TYPES_OPTIONS}
              onChange={(e) => setExamType(e.target.value)}
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
        {emptyData && (
          <>
            <Panel>
              <div className={styles.emptyData}>
                <FontAwesomeIcon icon={faBell} color={'#1EE67D'} />
                <p className={rubik.className}>
                  No se han encontrado <br />
                  resultados
                </p>
              </div>
            </Panel>
          </>
        )}
        {!emptyData && (
          <>
            <Panel>
              {genders.masculino !== '' && (
                <>
                  <PanelIcon icon={'users'} title={'Población Evaluada'}>
                    <div className={styles.grid3}>
                      <StatisticsGenders data={genders} />
                      {/* <StatisticsAges data={ages} /> */}
                      <ChartMultipleBars
                        title={'Según edad'}
                        data={ages.map((item) => {
                          return {
                            value: item.cantidad,
                            label: item.rango_edad
                          }
                        })}
                      />
                      {/* <StatisticsMedicalFitness data={medicalFitness} /> */}
                      <ChartMultipleBars
                        title={'Según aptitud médica'}
                        data={[
                          {
                            value: medicalFitness[0]?.APTO || 0,
                            label: 'Apto'
                          },
                          {
                            value:
                              medicalFitness[0]?.APTO_CON_RESTRICCIONES || 0,
                            label: 'Apto con restricciones'
                          },
                          {
                            value: medicalFitness[0]?.NO_APTO || 0,
                            label: 'No apto'
                          },
                          {
                            value: medicalFitness[0]?.OBSERVADO || 0,
                            label: 'Observado'
                          }
                        ]}
                      />
                    </div>
                  </PanelIcon>
                  <PanelIcon
                    icon={'notes-medical'}
                    title={'Medicina'}
                    container={false}
                  >
                    <div className={styles.gridMedical}>
                      <StatisticsIMC data={nutritionalProfile} />
                      {/* <StatisticsBloodPressure data={bloodPressureData} /> */}
                      <ChartMultipleBars
                        title={'Presión Arterial'}
                        data={bloodPressureData.map((item) => {
                          return {
                            value: item.cantidad,
                            label: item.categoria
                          }
                        })}
                      />
                    </div>
                    <div className={styles.gridFullWidth}>
                      <StatisticsOsteoMuscularPathologies
                        data={osteoMuscularPathologies}
                      />
                    </div>
                  </PanelIcon>
                  <PanelIcon icon={'laboratory'} title={'Laboratorio'}>
                    <div className={styles.gridFullWidth}>
                      <StatisticsLaboratoryExams data={laboratoryExams} />
                    </div>
                  </PanelIcon>
                  <div className={styles.grid2}>
                    <PanelIcon icon={'audiometry'} title={'Audiometría'}>
                      <StatisticsAudiometry data={audiometry} />
                    </PanelIcon>
                    <PanelIcon icon={'spirometry'} title={'Espirometría'}>
                      <StatisticsSpirometry data={spirometry} />
                    </PanelIcon>
                  </div>
                  <PanelIcon icon={'ophthalmology'} title={'Oftalmología'}>
                    <div className={styles.gridOftalmo}>
                      {/* <StatisticsVisualAcuity data={visualAcuity} /> */}
                      <ChartMultipleBars
                        title={'Agudeza Visual'}
                        data={visualAcuity.map((item) => {
                          return {
                            value: item.cantidad,
                            label: item.categoria
                          }
                        })}
                      />
                      <StatisticsOtherConditions data={otherConditions} />
                    </div>
                  </PanelIcon>
                  <div className={styles.grid3}>
                    <PanelIcon icon={'xray'} title={'Radiografía de tórax'}>
                      {/* <StatisticsChestXRay data={chestXRay} /> */}
                      <ChartMultipleBars
                        title={''}
                        label={'Radiografía de tórax'}
                        data={chestXRay.map((item) => {
                          return {
                            value: item.cantidad,
                            label: item.categoria
                          }
                        })}
                      />
                    </PanelIcon>
                    <PanelIcon icon={'heart'} title={'Electrocardiograma'}>
                      {/* <StatisticsElectrocardiogram data={electrocardiogram} /> */}
                      <ChartMultipleBars
                        title={''}
                        label={'Electrocardiograma'}
                        data={electrocardiogram.map((item) => {
                          return {
                            value: item.cantidad,
                            label: item.categoria
                          }
                        })}
                      />
                    </PanelIcon>
                    <PanelIcon icon={'brain'} title={'Psicología'}>
                      {/* <StatisticsPsychology data={psychology} /> */}
                      <ChartMultipleBars
                        title={''}
                        label={'Psicología'}
                        data={psychology.map((item) => {
                          return {
                            value: item.cantidad,
                            label: item.categoria
                          }
                        })}
                      />
                    </PanelIcon>
                  </div>
                  <div className={styles.grid2}>
                    <PanelIcon icon={'hard-hat'} title={'Altura estructural'}>
                      {/* <StatisticsStructuralHeight data={structuralHeight} /> */}
                      <ChartMultipleBars
                        title={''}
                        label={'Altura estructural'}
                        data={structuralHeight.map((item) => {
                          return {
                            value: item.cantidad,
                            label: item.categoria
                          }
                        })}
                      />
                    </PanelIcon>
                    <PanelIcon icon={'odontology'} title={'Odontología'}>
                      <StatisticsOdontology data={odontology} />
                    </PanelIcon>
                  </div>
                </>
              )}
            </Panel>
          </>
        )}
      </div>
    </>
  )
}

export default StatisticsPanel
