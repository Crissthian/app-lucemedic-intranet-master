export interface StatisticsRequestDTO {
  startDate: string
  endDate: string
  examType?: string
  headquarter?: string
}

export interface Genders {
  masculino: string
  femenino: string
}

export interface Ages {
  rango_edad: string
  cantidad: number
}

export interface MedicalFitness {
  APTO: number
  APTO_CON_RESTRICCIONES: number
  NO_APTO: number
  OBSERVADO: number
  total: number
}

export interface BloodPressure {
  categoria: string
  cantidad: number
}

export interface OsteoMuscularPathologies {
  categoria: string
  cantidad: number
}

export interface LaboratoryExams {
  categoria: string
  cantidad: number
}

export interface Audiometry {
  categoria: string
  cantidad: number
}

export interface Spirometry {
  categoria: string
  cantidad: number
}

export interface VisualAcuity {
  categoria: string
  cantidad: number
}

export interface OtherConditions {
  categoria: string
  cantidad: number
}

export interface ChestXRay {
  categoria: string
  cantidad: number
}

export interface Electrocardiogram {
  categoria: string
  cantidad: number
}

export interface Psychology {
  categoria: string
  cantidad: number
}

export interface Odontology {
  categoria: string
  cantidad: number
}

export interface StructuralHeight {
  categoria: string
  cantidad: number
}

export interface PieGraphData {
  label: string
  value: number
}
