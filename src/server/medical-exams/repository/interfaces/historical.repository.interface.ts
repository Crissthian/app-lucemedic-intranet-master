import { Audiometry, IMCReport, LaboratoryExamsReport, Radiology } from '../entity'
import { CardiologyReport } from '../entity/cardiology-report'

export interface IHistoricalRepository {
  findRadiology(dni: string): Promise<Radiology[]>;
  findAudiometry(dni: string): Promise<Audiometry[]>;
  findCardiology(dni: string): Promise<CardiologyReport[]>;
  findIMC(dni: string): Promise<IMCReport[]>;
  findLaboratoryExams(dni: string): Promise<LaboratoryExamsReport[]>;
}

