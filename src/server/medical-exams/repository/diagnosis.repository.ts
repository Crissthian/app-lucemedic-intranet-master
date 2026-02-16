import {
  DB_HOST,
  DB_INSTANCE,
  DB_NAME,
  DB_PASS,
  DB_USER,
  Database,
  QueryParams
} from '../../shared'
import { Diagnosis } from './entity'
import { IDiagnosisRepository } from './interfaces/diagnosis.repository.interface'

export default class DiagnosisRepository implements IDiagnosisRepository {
  private readonly database: Database

  constructor() {
    this.database = new Database({
      server: DB_HOST,
      user: DB_USER,
      password: DB_PASS,
      database: DB_NAME,
      options: {
        encrypt: false,
        trustServerCertificate: true,
        instanceName: DB_INSTANCE
      }
    })
  }

  async findMedicina(cdg_fmed: string): Promise<Diagnosis[]> {
    try {
      const query =
        'SELECT LTRIM(RTRIM(OBS_MEDICINA)) AS diagnostico FROM M_FMED WHERE cdg_fmed=@cdg_fmed'
      const queryParams: QueryParams = { cdg_fmed }

      const result = await this.database.queryWithParams<Diagnosis>(
        query,
        queryParams
      )

      if (!result.success) {
        return []
      }

      return result.data
    } catch (error: unknown) {
      throw error
    }
  }

  async findOftalmologia(cdg_fmed: string): Promise<Diagnosis[]> {
    try {
      const query =
        'SELECT con_oftal AS diagnostico FROM M_FMED WHERE cdg_fmed=@cdg_fmed'
      const queryParams: QueryParams = { cdg_fmed }

      const result = await this.database.queryWithParams<Diagnosis>(
        query,
        queryParams
      )

      if (!result.success) {
        return []
      }

      return result.data
    } catch (error: unknown) {
      throw error
    }
  }

  async findOtorrino(cdg_fmed: string): Promise<Diagnosis[]> {
    try {
      const query =
        'SELECT obs_audio AS diagnostico FROM M_FMED WHERE cdg_fmed=@cdg_fmed'
      const queryParams: QueryParams = { cdg_fmed }

      const result = await this.database.queryWithParams<Diagnosis>(
        query,
        queryParams
      )

      if (!result.success) {
        return []
      }

      return result.data
    } catch (error: unknown) {
      throw error
    }
  }

  async findRadiologia(cdg_fmed: string): Promise<Diagnosis[]> {
    try {
      const query =
        'SELECT obs_radio AS diagnostico FROM M_FMED WHERE cdg_fmed=@cdg_fmed'
      const queryParams: QueryParams = { cdg_fmed }

      const result = await this.database.queryWithParams<Diagnosis>(
        query,
        queryParams
      )

      if (!result.success) {
        return []
      }

      return result.data
    } catch (error: unknown) {
      throw error
    }
  }

  async findLaboratorio(cdg_fmed: string): Promise<Diagnosis[]> {
    try {
      const query =
        'SELECT obs_labo AS diagnostico FROM M_FMED WHERE cdg_fmed=@cdg_fmed'
      const queryParams: QueryParams = { cdg_fmed }

      const result = await this.database.queryWithParams<Diagnosis>(
        query,
        queryParams
      )

      if (!result.success) {
        return []
      }

      return result.data
    } catch (error: unknown) {
      throw error
    }
  }

  async findOdontologia(cdg_fmed: string): Promise<Diagnosis[]> {
    try {
      const query =
        'SELECT con_denta AS diagnostico FROM M_FMED WHERE cdg_fmed=@cdg_fmed'
      const queryParams: QueryParams = { cdg_fmed }

      const result = await this.database.queryWithParams<Diagnosis>(
        query,
        queryParams
      )

      if (!result.success) {
        return []
      }

      return result.data
    } catch (error: unknown) {
      throw error
    }
  }

  async findCardiologia(cdg_fmed: string): Promise<Diagnosis[]> {
    try {
      const query =
        'SELECT con_cardio AS diagnostico FROM M_FMED WHERE cdg_fmed=@cdg_fmed'
      const queryParams: QueryParams = { cdg_fmed }

      const result = await this.database.queryWithParams<Diagnosis>(
        query,
        queryParams
      )

      if (!result.success) {
        return []
      }

      return result.data
    } catch (error: unknown) {
      throw error
    }
  }

  async findEspirometria(cdg_fmed: string): Promise<Diagnosis[]> {
    try {
      const query =
        'SELECT obs_espiro AS diagnostico FROM M_FMED WHERE cdg_fmed=@cdg_fmed'
      const queryParams: QueryParams = { cdg_fmed }

      const result = await this.database.queryWithParams<Diagnosis>(
        query,
        queryParams
      )

      if (!result.success) {
        return []
      }

      return result.data
    } catch (error: unknown) {
      throw error
    }
  }

  async findPsicologia(cdg_fmed: string): Promise<Diagnosis[]> {
    try {
      const query =
        'SELECT obs_psico AS diagnostico FROM M_FMED WHERE cdg_fmed=@cdg_fmed'
      const queryParams: QueryParams = { cdg_fmed }

      const result = await this.database.queryWithParams<Diagnosis>(
        query,
        queryParams
      )

      if (!result.success) {
        return []
      }

      return result.data
    } catch (error: unknown) {
      throw error
    }
  }
}
