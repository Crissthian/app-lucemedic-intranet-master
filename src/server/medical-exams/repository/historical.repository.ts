import {
  DB_HOST,
  DB_INSTANCE,
  DB_NAME,
  DB_PASS,
  DB_USER,
  Database,
  QueryParams
} from '../../shared'
import {
  Audiometry,
  IMCReport,
  LaboratoryExamsReport,
  Radiology
} from './entity'
import { CardiologyReport } from './entity/cardiology-report'
import { IHistoricalRepository } from './interfaces/historical.repository.interface'

export default class HistoricalRepository implements IHistoricalRepository {
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

  async findRadiology(dni: string): Promise<Radiology[]> {
    try {
      // const query = `select top 3r.cdg_reg,f.cdg_fmed from m_rayosx r,m_fmed f where r.cdg_fmed=f.cdg_fmed and f.num_dni='${dni}' order by cdg_reg desc`;
      const query = "select top 3r.cdg_reg,f.cdg_fmed,f.fec_fmed,LTRIM(RTRIM(EXA.DES_ITEM)) AS t_examen from m_rayosx r,m_fmed f,D_TABLAS exa where r.cdg_fmed=f.cdg_fmed and f.num_dni=@dni and f.eweb=1 and (f.tip_Exa = EXA.NUM_ITEM AND EXA.cdg_tab='EXA') and f.tip_exa <>'004' order by cdg_reg desc"
      const queryParams: QueryParams = { dni }

      const result = await this.database.queryWithParams<Radiology>(
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

  async findAudiometry(dni: string): Promise<Audiometry[]> {
    try {
      // const query = `select top 3 O.cdg_reg,rtrim(ltrim(year(O.fec_reg))) as year,ltrim(rtrim(DATENAME(month, O.fec_reg))) as month from M_OTORRINO O,m_fmed F where O.cdg_fmed=F.cdg_fmed AND F.num_dni='${dni}' AND F.EWEB=1 order by 1 desc`;
      const query = "select top 3 O.cdg_reg,rtrim(ltrim(year(O.fec_reg))) as year,ltrim(rtrim(DATENAME(month, O.fec_reg))) as month, f.cdg_fmed,f.fec_fmed,LTRIM(RTRIM(EXA.DES_ITEM)) AS t_examen, f.obs_audio from M_OTORRINO O,m_fmed F,D_TABLAS exa where O.cdg_fmed=F.cdg_fmed AND F.num_dni=@dni AND f.eweb=1 and (f.tip_Exa = EXA.NUM_ITEM AND EXA.cdg_tab='EXA') and f.tip_exa <>'004' order by 1 desc"
      const queryParams: QueryParams = { dni }

      const result = await this.database.queryWithParams<Audiometry>(
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

  async findCardiology(dni: string): Promise<CardiologyReport[]> {
    try {
      let data: CardiologyReport[] = []

      const query = 'select top 3 r.cdg_reg,r.fec_reg,r.PDIASTOLICA AS p_diastolica,r.PSISTOLICA AS p_sistolica, r.FCARDIACA AS f_cardiaca from M_TRIAJE r,m_fmed f where r.cdg_fmed=f.cdg_fmed and f.num_dni=@dni AND F.EWEB=1 order by cdg_reg desc'
      const queryParams: QueryParams = { dni }

      const result = await this.database.queryWithParams<CardiologyReport>(
        query,
        queryParams
      )

      if (!result.success) {
        return []
      }

      data = result.data

      return data
    } catch (error: unknown) {
      throw error
    }
  }

  async findIMC(dni: string): Promise<IMCReport[]> {
    try {
      let data: IMCReport[] = []

      const query = 'select top 3 r.cdg_reg,r.fec_reg,r.PESO AS peso,R.IMC AS imc from M_TRIAJE r,m_fmed f where r.cdg_fmed=f.cdg_fmed and f.num_dni=@dni AND F.EWEB=1 order by cdg_reg desc'
      const queryParams: QueryParams = { dni }

      const result = await this.database.queryWithParams<IMCReport>(
        query,
        queryParams
      )

      if (!result.success) {
        return []
      }

      data = result.data

      return data
    } catch (error: unknown) {
      throw error
    }
  }

  async findLaboratoryExams(dni: string): Promise<LaboratoryExamsReport[]> {
    try {
      let data: LaboratoryExamsReport[] = []

      const query = "select top 3r.cdg_reg,F.CDG_FMED AS cdg_fmed,r.fec_reg, (select isnull((select resultado from d_labo where cdg_exa=2 and  cdg_fmed=F.cdg_fmed),'-') ) as hemoglobina, (select (isnull((select resultado from d_labo where cdg_exa=16 and cdg_fmed=F.cdg_fmed),isnull((select resultado from d_labo where cdg_exa=22 and cdg_fmed=F.cdg_fmed),'-')))) as colesterol, (select(isnull((select resultado from d_labo where cdg_exa=17 and cdg_fmed=F.cdg_fmed),isnull((select resultado from d_labo where cdg_exa=111 and cdg_fmed=F.cdg_fmed),'-')))) as trigliceridos, (select isnull((select resultado from d_labo where cdg_exa=14 and cdg_fmed=F.cdg_fmed),'-')) as glucosa from LABORATORIO r,m_fmed f where r.cdg_fmed=f.cdg_fmed and f.num_dni=@dni and  f.tip_exa <>'004' and f.eweb=1  order by cdg_reg desc"
      const queryParams: QueryParams = { dni }

      // const query = `select top 3r.cdg_reg,F.CDG_FMED AS cdg_fmed, (select isnull((select resultado from d_labo where cdg_exa=2 and  cdg_fmed=F.cdg_fmed),'-') ) AS hemoglobina, (select (isnull((select resultado from d_labo where cdg_exa=16 and cdg_fmed=F.cdg_fmed),isnull((select resultado from d_labo where cdg_exa=22 and cdg_fmed=F.cdg_fmed),'-')))) as colesterol, (select(isnull((select resultado from d_labo where cdg_exa=17 and cdg_fmed=F.cdg_fmed),isnull((select resultado from d_labo where cdg_exa=111 and cdg_fmed=F.cdg_fmed),'-')))) as trigliceridos, (select isnull((select resultado from d_labo where cdg_exa=14 and cdg_fmed=F.cdg_fmed),'-')) as glucosa from LABORATORIO r,m_fmed f where r.cdg_fmed=f.cdg_fmed and f.num_dni='${dni}' and  f.tip_exa <>'004' and f.eweb=1  order by cdg_reg desc`;

      const result = await this.database.queryWithParams<LaboratoryExamsReport>(
        query,
        queryParams
      )

      if (!result.success) {
        return []
      }

      data = result.data

      return data
    } catch (error: unknown) {
      throw error
    }
  }
}
