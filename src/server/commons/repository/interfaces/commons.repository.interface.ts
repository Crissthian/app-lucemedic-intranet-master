import { EpidemiologicalReport } from '../../../medical-exams/repository/entity'
import { ExamType } from '../entity/examType'
import { Headquarter } from '../entity/headquarter'

export interface ICommonsRepository {
  findAllHeadquarters(): Promise<Headquarter[]>;
  findAllExamTypes(): Promise<ExamType[]>;
  findEpidemiologicalReport(ruc: string): Promise<EpidemiologicalReport[]>;
  uploadPhoto(photoURL: string, dni: string): Promise<boolean>;
}
