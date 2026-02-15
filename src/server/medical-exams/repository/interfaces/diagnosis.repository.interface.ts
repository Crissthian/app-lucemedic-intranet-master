import { Diagnosis } from '../entity'

export interface IDiagnosisRepository {
  findMedicina(uid: string): Promise<Diagnosis[]>
  findOftalmologia(uid: string): Promise<Diagnosis[]>
  findOtorrino(uid: string): Promise<Diagnosis[]>
  findRadiologia(uid: string): Promise<Diagnosis[]>
  findLaboratorio(uid: string): Promise<Diagnosis[]>
  findOdontologia(uid: string): Promise<Diagnosis[]>
  findCardiologia(uid: string): Promise<Diagnosis[]>
  findEspirometria(uid: string): Promise<Diagnosis[]>
  findPsicologia(uid: string): Promise<Diagnosis[]>
}
