export interface IPatientRepository {
  getMedicalDetails(fichaMedica: string): Promise<object>
}
