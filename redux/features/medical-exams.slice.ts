import { MedicalExams } from '@/models/medical-exams'
import { MedicalExamsDetails } from '@/models/medical-exams-details'
import { PayloadAction, createSlice } from '@reduxjs/toolkit'

// type MedicalExams = {
//   cdg_fmed: string,
//   fec_fmed: string,
//   cod_t_examen: string,
//   t_examen: string,
//   num_dni: string,
//   nombres: string,
//   apellidos: string,
// }

type InitialState = {
  showDetail: boolean,
  showMedicalHistory: boolean,
  showInterconsultas: boolean,
  showRecomendaciones: boolean,
  data: MedicalExams[],
  details: MedicalExamsDetails
}

const initialState = {
  showDetail: false,
  showMedicalHistory: false,
  showInterconsultas: false,
  showRecomendaciones: false,
  data: [],
  details: {
    cdg_fmed: '',
    fec_fmed: '',
    cod_tip_examen: '',
    tipo_examen: '',
    num_dni: '',
    nombres: '',
    apellidos: '',
    talla: 0,
    resp: 0,
    abd: 0,
    peso: 0,
    card: 0,
    cadera: 0,
    imc: 0,
    icc: 0,
    satoxi: 0,
    temp: 0,
    pamm: 0,
    ps: 0,
    hemoglobina: '',
    colesterol: '',
    trigliceridos: '',
    glucosa: ''
  }
} as InitialState

export const medicalExams = createSlice({
  name: 'medicalExams',
  initialState,
  reducers: {
    getDetail: (state, action: PayloadAction<MedicalExamsDetails>) => {
      return {
        ...state,
        details: action.payload
      }
    },
    toggleDetail: (state) => {
      return {
        ...state,
        showDetail: !state.showDetail
      }
    },
    toggleMedicalHistory: (state) => {
      return {
        ...state,
        showMedicalHistory: !state.showMedicalHistory
      }
    },
    toggleInterconsultas: (state) => {
      return {
        ...state,
        showInterconsultas: !state.showInterconsultas
      }
    },
    toggleRecomendaciones: (state) => {
      return {
        ...state,
        showRecomendaciones: !state.showRecomendaciones
      }
    }
  }
})

export const { getDetail, toggleDetail, toggleMedicalHistory, toggleInterconsultas, toggleRecomendaciones } = medicalExams.actions
export default medicalExams.reducer