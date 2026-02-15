import { MedicalExamsQueryDTO } from '../../dto/medical-exams-query.dto'
import {
  Consultations,
  EpidemiologicalReport,
  MedicalExams,
  MedicalRecord,
  Recommendations
} from '../entity'

export interface IMedicalExamsRepository {
  execute(query: string): Promise<object>
  findAll(params: MedicalExamsQueryDTO, ruc: string): Promise<MedicalExams[]>
  findByDNI(dni: string, ruc: string): Promise<MedicalExams[]>
  findBySede(sede: string, ruc: string): Promise<MedicalExams[]>
  findByExamType(examType: string, ruc: string): Promise<MedicalExams[]>
  findByDates(
    startDate: string,
    endDate: string,
    ruc: string
  ): Promise<MedicalExams[]>
  findByLastName(lastName: string, ruc: string): Promise<MedicalExams[]>
  findByFichaMedica(fichaMedica: string): Promise<MedicalRecord[]>
  findByDNIAndDates(dni: string): Promise<MedicalExams[]>
  findConsultations(uid: string): Promise<Consultations[]>
  findRecommendations(cdg_fmed: string): Promise<Recommendations[]>
  findEpidemiologicalReport(ruc: string): Promise<EpidemiologicalReport[]>
}
