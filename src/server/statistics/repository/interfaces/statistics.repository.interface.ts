import { StatisticsQueryDTO } from '../../dto/statistics.query.dto'
import { Age, Audiometry, BloodPressure, ChestXRay, Electrocardiogram, Exam, Gender, MedicalFitness, NutritionalProfile, Odontology, OsteoMuscularPathologies, OtherConditions, Psychology, StructuralHeight, VisualAcuity } from '../entity'
import { Spirometry } from '../entity/spirometry'

export interface IStatisticsRepository {
  check(params: StatisticsQueryDTO, ruc: string): Promise<boolean>;
  findGenders(params: StatisticsQueryDTO, ruc: string): Promise<Gender[]>;
  findAges(params: StatisticsQueryDTO, ruc: string): Promise<Age[]>;
  findMedicalFitness(params: StatisticsQueryDTO, ruc: string): Promise<MedicalFitness[]>;
  findNutritionalProfile(params: StatisticsQueryDTO, ruc: string): Promise<NutritionalProfile[]>;
  findBloodPressure(params: StatisticsQueryDTO, ruc: string): Promise<BloodPressure[]>;
  findOsteoMuscularPathologies(params: StatisticsQueryDTO, ruc: string): Promise<OsteoMuscularPathologies[]>;
  findExams(params: StatisticsQueryDTO, ruc: string): Promise<Exam[]>;
  findAudiometry(params: StatisticsQueryDTO, ruc: string): Promise<Audiometry[]>;
  findSpirometry(params: StatisticsQueryDTO, ruc: string): Promise<Spirometry[]>;
  findVisualAcuity(params: StatisticsQueryDTO, ruc: string): Promise<VisualAcuity[]>;
  findOtherConditions(params: StatisticsQueryDTO, ruc: string): Promise<OtherConditions[]>;
  findChestXRay(params: StatisticsQueryDTO, ruc: string): Promise<ChestXRay[]>;
  findElectrocardiogram(params: StatisticsQueryDTO, ruc: string): Promise<Electrocardiogram[]>;
  findPsychology(params: StatisticsQueryDTO, ruc: string): Promise<Psychology[]>;
  findStructuralHeight(params: StatisticsQueryDTO, ruc: string): Promise<StructuralHeight[]>;
  findOdontology(params: StatisticsQueryDTO, ruc: string): Promise<Odontology[]>;
}

