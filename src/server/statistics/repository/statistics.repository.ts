import {
  DB_HOST,
  DB_INSTANCE,
  DB_NAME,
  DB_PASS,
  DB_USER,
  Database,
  QueryParams,
  logger
} from '../../shared'
import { StatisticsQueryDTO } from '../dto/statistics.query.dto'
import {
  Gender,
  Age,
  MedicalFitness,
  NutritionalProfile,
  Audiometry,
  BloodPressure,
  Exam,
  OsteoMuscularPathologies,
  Spirometry,
  VisualAcuity,
  OtherConditions,
  ChestXRay,
  Electrocardiogram,
  Psychology,
  StructuralHeight,
  Odontology
} from './entity'
import { IStatisticsRepository } from './interfaces/statistics.repository.interface'

export default class StatisticsRepository implements IStatisticsRepository {
  private readonly database: Database

  constructor() {
    this.database = new Database({
      server: DB_HOST,
      user: DB_USER,
      password: DB_PASS,
      database: DB_NAME,
      requestTimeout: 60000,
      connectionTimeout: 60000,
      pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 60000
      },
      options: {
        encrypt: false,
        trustServerCertificate: true,
        instanceName: DB_INSTANCE
      }
    })
  }

  private addOptionalFilters(
    params: StatisticsQueryDTO,
    queryParams: QueryParams
  ): string {
    let filter = ''

    if (params.headquarter) {
      filter += ' AND f.cdg_sede=@headquarter'
      queryParams.headquarter = params.headquarter
    }

    if (params.examType) {
      filter += ' AND F.tip_exa=@examType'
      queryParams.examType = params.examType
    }

    return filter
  }

  async findGenders(
    params: StatisticsQueryDTO,
    ruc: string
  ): Promise<Gender[]> {
    try {
      let data: Gender[] = []

      const queryParams: QueryParams = {
        ruc,
        startDate: params.startDate,
        endDate: params.endDate
      }

      let query = `
      SELECT COUNT(CASE WHEN sexo = 'Masculino' THEN 1 END) AS masculino,COUNT(CASE WHEN sexo = 'FEMENINO' THEN 1 END) AS femenino, COUNT(*) AS total FROM [dbo].[M_MSABANA] m ,m_fmed f,vclientes C,vpaciente P,D_TABLAS exa where ruc_SAB=@ruc and m.cdg_fmed=f.cdg_fmed and (F.num_dni=P.NUM_DNI) and (F.tip_exa=EXA.NUM_ITEM AND EXA.CDG_TAB='EXA') and m.ruc_SAB=c.RUC_CLI and f.fec_fmed between @startDate and @endDate
      `

      query += this.addOptionalFilters(params, queryParams)

      const result = await this.database.queryWithParams<Gender>(
        query,
        queryParams
      )

      if (!result.success) {
        return data
      }

      data = result.data

      return data
    } catch (error: unknown) {
      throw error
    }
  }

  async findAges(params: StatisticsQueryDTO, ruc: string): Promise<Age[]> {
    try {
      let data: Age[] = []

      const queryParams: QueryParams = {
        ruc,
        startDate: params.startDate,
        endDate: params.endDate
      }

      let query = `
      SELECT CASE WHEN P.edad BETWEEN 18 AND 39 THEN '18-39 años' WHEN P.edad BETWEEN 40 AND 49 THEN '40-49 años' WHEN P.edad >= 50 THEN '50 años o más' END AS rango_edad, COUNT(*) AS cantidad FROM [dbo].[M_MSABANA] m ,m_fmed f,vclientes C,vpaciente P,D_TABLAS exa where ruc_SAB=@ruc and m.cdg_fmed=f.cdg_fmed and (F.num_dni=P.NUM_DNI) and (F.tip_exa=EXA.NUM_ITEM AND EXA.CDG_TAB='EXA') and m.ruc_SAB=c.RUC_CLI and f.fec_fmed between @startDate and @endDate
      `

      query += this.addOptionalFilters(params, queryParams)

      query +=
        " GROUP BY CASE WHEN P.edad BETWEEN 18 AND 39 THEN '18-39 años' WHEN P.edad BETWEEN 40 AND 49 THEN '40-49 años' WHEN P.edad >= 50 THEN '50 años o más' END"

      const result = await this.database.queryWithParams<Age>(
        query,
        queryParams
      )

      if (!result.success) {
        return data
      }

      data = result.data

      return data
    } catch (error: unknown) {
      throw error
    }
  }

  async findMedicalFitness(
    params: StatisticsQueryDTO,
    ruc: string
  ): Promise<MedicalFitness[]> {
    try {
      let data: MedicalFitness[] = []

      const queryParams: QueryParams = {
        ruc,
        startDate: params.startDate,
        endDate: params.endDate
      }

      let query = `
      SELECT COUNT(CASE WHEN aptitud = 1 THEN 1 END) AS APTO, COUNT(CASE WHEN aptitud = 2 THEN 1 END) AS [APTO_CON_RESTRICCIONES], COUNT(CASE WHEN aptitud = 3 THEN 1 END) AS [NO_APTO], COUNT(CASE WHEN aptitud = 4 THEN 1 END) AS OBSERVADO, COUNT(*) AS total FROM [dbo].[M_MSABANA] m, m_fmed f,vclientes C,vpaciente P,D_TABLAS exa where ruc_SAB=@ruc and m.cdg_fmed=f.cdg_fmed and (F.num_dni=P.NUM_DNI)and(F.tip_exa=EXA.NUM_ITEM AND EXA.CDG_TAB='EXA') and m.ruc_SAB=c.RUC_CLI and f.fec_fmed between @startDate and @endDate
      `

      query += this.addOptionalFilters(params, queryParams)

      const result = await this.database.queryWithParams<MedicalFitness>(
        query,
        queryParams
      )

      if (!result.success) {
        return data
      }

      data = result.data

      return data
    } catch (error: unknown) {
      throw error
    }
  }

  async findNutritionalProfile(
    params: StatisticsQueryDTO,
    ruc: string
  ): Promise<NutritionalProfile[]> {
    try {
      let data: NutritionalProfile[] = []

      const queryParams: QueryParams = {
        ruc,
        startDate: params.startDate,
        endDate: params.endDate
      }

      let conditional =
        'm.ruc_SAB=c.RUC_CLI and f.fec_fmed between @startDate and @endDate'
      conditional += this.addOptionalFilters(params, queryParams)

      const query = `
      SELECT 'NORMAL' AS categoria, COUNT(*) AS cantidad FROM [dbo].[M_MSABANA] m ,m_fmed f,vclientes C,vpaciente P,D_TABLAS exa where ruc_SAB=@ruc and m.cdg_fmed=f.cdg_fmed and (F.num_dni=P.NUM_DNI)and(F.tip_exa=EXA.NUM_ITEM AND EXA.CDG_TAB='EXA') and ${conditional} AND 'NORMAL' IN (med_1, med_2, med_3, med_4, med_5) UNION SELECT  'SOBREPESO' AS categoria, COUNT(*) AS cantidad FROM [dbo].[M_MSABANA] m ,m_fmed f,vclientes C,vpaciente P,D_TABLAS exa where ruc_SAB=@ruc and m.cdg_fmed=f.cdg_fmed and (F.num_dni=P.NUM_DNI)and(F.tip_exa=EXA.NUM_ITEM AND EXA.CDG_TAB='EXA') and ${conditional} AND 'SOBREPESO' IN (ltrim(rtrim(med_1)), ltrim(rtrim(med_2)), ltrim(rtrim(med_3)),ltrim(rtrim(med_4)),ltrim(rtrim(med_5))) UNION SELECT  'OBESIDAD I°' AS categoria, COUNT(*) AS cantidad FROM [dbo].[M_MSABANA] m ,m_fmed f,vclientes C,vpaciente P,D_TABLAS exa where ruc_SAB=@ruc and m.cdg_fmed=f.cdg_fmed and (F.num_dni=P.NUM_DNI)and(F.tip_exa=EXA.NUM_ITEM AND EXA.CDG_TAB='EXA') and ${conditional} AND 'OBESIDAD I°' IN (ltrim(rtrim(med_1)), ltrim(rtrim(med_2)), ltrim(rtrim(med_3)),ltrim(rtrim(med_4)),ltrim(rtrim(med_5))) UNION SELECT  'OBESIDAD II°' AS categoria,  COUNT(*) AS cantidad  FROM [dbo].[M_MSABANA] m ,m_fmed f,vclientes C,vpaciente P,D_TABLAS exa where ruc_SAB=@ruc and m.cdg_fmed=f.cdg_fmed and (F.num_dni=P.NUM_DNI)and(F.tip_exa=EXA.NUM_ITEM AND EXA.CDG_TAB='EXA') and ${conditional} AND 'OBESIDAD II°' IN (ltrim(rtrim(med_1)), ltrim(rtrim(med_2)), ltrim(rtrim(med_3)),ltrim(rtrim(med_4)),ltrim(rtrim(med_5))) UNION SELECT  'OBESIDAD III°' AS categoria, COUNT(*) AS cantidad FROM [dbo].[M_MSABANA] m ,m_fmed f,vclientes C,vpaciente P,D_TABLAS exa where ruc_SAB=@ruc and m.cdg_fmed=f.cdg_fmed and (F.num_dni=P.NUM_DNI)and(F.tip_exa=EXA.NUM_ITEM AND EXA.CDG_TAB='EXA') and ${conditional} AND 'OBESIDAD III°' IN (ltrim(rtrim(med_1)), ltrim(rtrim(med_2)), ltrim(rtrim(med_3)),ltrim(rtrim(med_4)),ltrim(rtrim(med_5))) UNION SELECT  'TOTAL' AS categoria,  COUNT(*) AS cantidad FROM [dbo].[M_MSABANA] m ,m_fmed f,vclientes C,vpaciente P,D_TABLAS exa where ruc_SAB=@ruc and m.cdg_fmed=f.cdg_fmed and (F.num_dni=P.NUM_DNI)and(F.tip_exa=EXA.NUM_ITEM AND EXA.CDG_TAB='EXA') and ${conditional}`

      const result = await this.database.queryWithParams<NutritionalProfile>(
        query,
        queryParams
      )

      if (!result.success) {
        return data
      }

      data = result.data

      return data
    } catch (error: unknown) {
      throw error
    }
  }

  async findBloodPressure(
    params: StatisticsQueryDTO,
    ruc: string
  ): Promise<BloodPressure[]> {
    try {
      let data: BloodPressure[] = []

      const queryParams: QueryParams = {
        ruc,
        startDate: params.startDate,
        endDate: params.endDate
      }

      let conditional =
        'm.ruc_SAB=c.RUC_CLI and f.fec_fmed between @startDate and @endDate'
      conditional += this.addOptionalFilters(params, queryParams)

      const query = `
      SELECT 'VALOR ELEVADO DE PRESIÓN ARTERIAL' AS categoria, COUNT(*) AS cantidad FROM [dbo].[M_MSABANA] m ,m_fmed f,vclientes C,vpaciente P,D_TABLAS exa where ruc_SAB=@ruc and m.cdg_fmed=f.cdg_fmed and (F.num_dni=P.NUM_DNI)and(F.tip_exa=EXA.NUM_ITEM AND EXA.CDG_TAB='EXA') and ${conditional} AND 'VALOR ELEVADO DE PRESIÓN ARTERIAL' IN (ltrim(rtrim(med_1)), ltrim(rtrim(med_2)), ltrim(rtrim(med_3)),ltrim(rtrim(med_4)),ltrim(rtrim(med_5))) UNION SELECT 'HIPERTENSIÓN ARTERIAL °' AS categoria, COUNT(*) AS cantidad FROM [dbo].[M_MSABANA] m ,m_fmed f,vclientes C,vpaciente P,D_TABLAS exa where ruc_SAB=@ruc and m.cdg_fmed=f.cdg_fmed and (F.num_dni=P.NUM_DNI)and(F.tip_exa=EXA.NUM_ITEM AND EXA.CDG_TAB='EXA') and ${conditional} AND 'HIPERTENSIÓN ARTERIAL ' IN (ltrim(rtrim(med_1)), ltrim(rtrim(med_2)), ltrim(rtrim(med_3)),ltrim(rtrim(med_4)),ltrim(rtrim(med_5))) UNION SELECT 'TOTAL' AS categoria, COUNT(*) AS cantidad FROM [dbo].[M_MSABANA] m ,m_fmed f,vclientes C,vpaciente P,D_TABLAS exa where ruc_SAB=@ruc and m.cdg_fmed=f.cdg_fmed and (F.num_dni=P.NUM_DNI)and(F.tip_exa=EXA.NUM_ITEM AND EXA.CDG_TAB='EXA') and ${conditional}`

      const result = await this.database.queryWithParams<BloodPressure>(
        query,
        queryParams
      )

      if (!result.success) {
        return data
      }

      data = result.data

      return data
    } catch (error: unknown) {
      throw error
    }
  }

  async findOsteoMuscularPathologies(
    params: StatisticsQueryDTO,
    ruc: string
  ): Promise<OsteoMuscularPathologies[]> {
    try {
      let data: OsteoMuscularPathologies[] = []

      const queryParams: QueryParams = {
        ruc,
        startDate: params.startDate,
        endDate: params.endDate
      }

      let where =
        'ruc_SAB=@ruc AND m.cdg_fmed=f.cdg_fmed AND (F.num_dni=P.NUM_DNI)and(F.tip_exa=EXA.NUM_ITEM AND EXA.CDG_TAB=\'EXA\') AND m.ruc_SAB=c.RUC_CLI AND f.fec_fmed between @startDate AND @endDate'
      where += this.addOptionalFilters(params, queryParams)

      const query = `SELECT 
        'DOLOR ARTICULAR' AS categoria, 
        COUNT(*) AS cantidad 
      FROM [dbo].[M_MSABANA] m ,m_fmed f,vclientes C,vpaciente P,D_TABLAS exa
      where ${where} AND
      'DOLOR ARTICULAR' IN (ltrim(rtrim(med_1)), ltrim(rtrim(med_2)), ltrim(rtrim(med_3)),ltrim(rtrim(med_4)),ltrim(rtrim(med_5)))
      UNION
      SELECT 
        'LUMBALGIA' AS categoria, 
        COUNT(*) AS cantidad 
      FROM [dbo].[M_MSABANA] m ,m_fmed f,vclientes C,vpaciente P,D_TABLAS exa
      where ${where} AND
        'LUMBALGIA' IN (ltrim(rtrim(med_1)), ltrim(rtrim(med_2)), ltrim(rtrim(med_3)),ltrim(rtrim(med_4)),ltrim(rtrim(med_5)))
      UNION
      SELECT 
        'DORSALGIA' AS categoria, 
        COUNT(*) AS cantidad 
        FROM [dbo].[M_MSABANA] m ,m_fmed f,vclientes C,vpaciente P,D_TABLAS exa
      where ${where} AND
      'DORSALGIA' IN (ltrim(rtrim(med_1)), ltrim(rtrim(med_2)), ltrim(rtrim(med_3)),ltrim(rtrim(med_4)),ltrim(rtrim(med_5)))
      UNION
      SELECT 
        'VÁRICES DE MIEMBROS INFERIORES' AS categoria, 
        COUNT(*) AS cantidad 
        FROM [dbo].[M_MSABANA] m ,m_fmed f,vclientes C,vpaciente P,D_TABLAS exa
      where ${where} AND
      'VÁRICES DE MIEMBROS INFERIORES' IN (ltrim(rtrim(med_1)), ltrim(rtrim(med_2)), ltrim(rtrim(med_3)),ltrim(rtrim(med_4)),ltrim(rtrim(med_5)))
      UNION
      SELECT 
        'CONTRACTURA MUSCULAR' AS categoria, 
        COUNT(*) AS cantidad 
      FROM [dbo].[M_MSABANA] m ,m_fmed f,vclientes C,vpaciente P,D_TABLAS exa
      where ${where} AND
      'CONTRACTURA MUSCULAR' IN (ltrim(rtrim(med_1)), ltrim(rtrim(med_2)), ltrim(rtrim(med_3)),ltrim(rtrim(med_4)),ltrim(rtrim(med_5)))
      UNION
      SELECT 
        'TOTAL' AS categoria, 
        COUNT(*) AS cantidad 
      FROM [dbo].[M_MSABANA] m ,m_fmed f,vclientes C,vpaciente P,D_TABLAS exa
      where ${where}`

      const result =
        await this.database.queryWithParams<OsteoMuscularPathologies>(
          query,
          queryParams
        )

      if (!result.success) {
        return data
      }

      data = result.data

      return data
    } catch (error: unknown) {
      throw error
    }
  }

  async findExams(params: StatisticsQueryDTO, ruc: string): Promise<Exam[]> {
    try {
      let data: Exam[] = []

      const queryParams: QueryParams = {
        ruc,
        startDate: params.startDate,
        endDate: params.endDate,
        headquarter: params.headquarter,
        examType: params.examType
      }

      const where =
        "ruc_SAB=@ruc AND m.cdg_fmed=f.cdg_fmed AND (F.num_dni=P.NUM_DNI)and(F.tip_exa=EXA.NUM_ITEM AND EXA.CDG_TAB='EXA') AND m.ruc_SAB=c.RUC_CLI AND f.fec_fmed between @startDate AND @endDate AND f.cdg_sede=@headquarter AND F.tip_exa=@examType"

      const query = `
      SELECT 
        'EXÁMENES DE LABORATORIO NORMALES.' AS categoria, 
        COUNT(*) AS cantidad 
      FROM [dbo].[M_MSABANA] m ,m_fmed f,vclientes C,vpaciente P,D_TABLAS exa
      where ${where} AND
      'EXÁMENES DE LABORATORIO NORMALES.' IN (ltrim(rtrim(LAD_1)), ltrim(rtrim(LAD_2)), ltrim(rtrim(LAD_3)),ltrim(rtrim(LAD_4)),ltrim(rtrim(LAD_5)))
      UNION
      SELECT 
        'HIPERCOLESTEROLEMIA' AS categoria, 
        COUNT(*) AS cantidad 
      FROM [dbo].[M_MSABANA] m ,m_fmed f,vclientes C,vpaciente P,D_TABLAS exa
      where ${where} AND
        'HIPERCOLESTEROLEMIA' IN (ltrim(rtrim(LAD_1)), ltrim(rtrim(LAD_2)), ltrim(rtrim(LAD_3)),ltrim(rtrim(LAD_4)),ltrim(rtrim(LAD_5)))
      UNION
      SELECT 
        'HIPERTRIGLICERIDEMIA' AS categoria, 
        COUNT(*) AS cantidad 
        FROM [dbo].[M_MSABANA] m ,m_fmed f,vclientes C,vpaciente P,D_TABLAS exa
      where ${where} AND
      'HIPERTRIGLICERIDEMIA' IN (ltrim(rtrim(LAD_1)), ltrim(rtrim(LAD_2)), ltrim(rtrim(LAD_3)),ltrim(rtrim(LAD_4)),ltrim(rtrim(LAD_5)))
      UNION
      SELECT 
        'DISLIPIDEMIA MIXTA' AS categoria, 
        COUNT(*) AS cantidad 
        FROM [dbo].[M_MSABANA] m ,m_fmed f,vclientes C,vpaciente P,D_TABLAS exa
      where ${where} AND
      'DISLIPIDEMIA MIXTA' IN (ltrim(rtrim(LAD_1)), ltrim(rtrim(LAD_2)), ltrim(rtrim(LAD_3)),ltrim(rtrim(LAD_4)),ltrim(rtrim(LAD_5)))
      UNION
      SELECT 
        'HIPERTRIGLICERIDEMIA' AS categoria, 
        COUNT(*) AS cantidad 
      FROM [dbo].[M_MSABANA] m ,m_fmed f,vclientes C,vpaciente P,D_TABLAS exa
      where ${where} AND
      'HIPERTRIGLICERIDEMIA' IN (ltrim(rtrim(LAD_1)), ltrim(rtrim(LAD_2)), ltrim(rtrim(LAD_3)),ltrim(rtrim(LAD_4)),ltrim(rtrim(LAD_5)))
      UNION
      SELECT 
        'TOTAL' AS categoria, 
        COUNT(*) AS cantidad 
      FROM [dbo].[M_MSABANA] m ,m_fmed f,vclientes C,vpaciente P,D_TABLAS exa
      where ${where}`

      const result = await this.database.queryWithParams<Exam>(
        query,
        queryParams
      )

      if (!result.success) {
        return data
      }

      data = result.data

      return data
    } catch (error: unknown) {
      throw error
    }
  }

  async findAudiometry(
    params: StatisticsQueryDTO,
    ruc: string
  ): Promise<Audiometry[]> {
    try {
      let data: Audiometry[] = []

      const queryParams: QueryParams = {
        ruc,
        startDate: params.startDate,
        endDate: params.endDate
      }

      let where = ' AND f.fec_fmed BETWEEN @startDate AND @endDate'
      where += this.addOptionalFilters(params, queryParams)

      let query = `
      SELECT 
        'AUDICIÓN NORMAL' AS categoria, 
        COUNT(*) AS cantidad 
      FROM [dbo].[M_MSABANA] m, m_fmed f, vclientes C, vpaciente P, D_TABLAS exa
      WHERE 
        m.ruc_SAB = @ruc 
        AND m.cdg_fmed = f.cdg_fmed 
        AND F.num_dni = P.NUM_DNI 
        AND F.tip_exa = EXA.NUM_ITEM 
        AND EXA.CDG_TAB = 'EXA'
        AND m.ruc_SAB = c.RUC_CLI 
        ${where}
        AND (
          LTRIM(RTRIM(OTD_1)) LIKE 'AUDICIÓN NORMAL' 
          OR LTRIM(RTRIM(OTD_2)) LIKE 'AUDICIÓN NORMAL' 
          OR LTRIM(RTRIM(OTD_3)) LIKE 'AUDICIÓN NORMAL' 
          OR LTRIM(RTRIM(OTD_4)) LIKE 'AUDICIÓN NORMAL' 
          OR LTRIM(RTRIM(OTD_5)) LIKE 'AUDICIÓN NORMAL'
        )
        union
        SELECT 
        'HIPOACUSIA CONDUCTIVA' AS categoria, 
        COUNT(*) AS cantidad 
      FROM [dbo].[M_MSABANA] m, m_fmed f, vclientes C, vpaciente P, D_TABLAS exa
      WHERE 
        m.ruc_SAB = @ruc 
        AND m.cdg_fmed = f.cdg_fmed 
        AND F.num_dni = P.NUM_DNI 
        AND F.tip_exa = EXA.NUM_ITEM 
        AND EXA.CDG_TAB = 'EXA'
        AND m.ruc_SAB = c.RUC_CLI 
        ${where}
        AND (
          LTRIM(RTRIM(OTD_1)) LIKE 'HIPOACUSIA CONDUCTIVA%' 
          OR LTRIM(RTRIM(OTD_2)) LIKE 'HIPOACUSIA CONDUCTIVA%' 
          OR LTRIM(RTRIM(OTD_3)) LIKE 'HIPOACUSIA CONDUCTIVA%' 
          OR LTRIM(RTRIM(OTD_4)) LIKE 'HIPOACUSIA CONDUCTIVA%' 
          OR LTRIM(RTRIM(OTD_5)) LIKE 'HIPOACUSIA CONDUCTIVA%'
        )
        union
          SELECT 
        'HIPOACUSIA NEUROSENSORIAL' AS categoria, 
        COUNT(*) AS cantidad 
      FROM [dbo].[M_MSABANA] m, m_fmed f, vclientes C, vpaciente P, D_TABLAS exa
      WHERE 
        m.ruc_SAB = @ruc 
        AND m.cdg_fmed = f.cdg_fmed 
        AND F.num_dni = P.NUM_DNI 
        AND F.tip_exa = EXA.NUM_ITEM 
        AND EXA.CDG_TAB = 'EXA'
        AND m.ruc_SAB = c.RUC_CLI 
        ${where}
        AND (
          LTRIM(RTRIM(OTD_1)) LIKE 'HIPOACUSIA NEUROSENSORIAL%' 
          OR LTRIM(RTRIM(OTD_2)) LIKE 'HIPOACUSIA NEUROSENSORIAL%' 
          OR LTRIM(RTRIM(OTD_3)) LIKE 'HIPOACUSIA NEUROSENSORIAL%' 
          OR LTRIM(RTRIM(OTD_4)) LIKE 'HIPOACUSIA NEUROSENSORIAL%' 
          OR LTRIM(RTRIM(OTD_5)) LIKE 'HIPOACUSIA NEUROSENSORIAL%'
        )
        union
        SELECT 
        'HIPOACUSIA MIXTA' AS categoria, 
        COUNT(*) AS cantidad 
      FROM [dbo].[M_MSABANA] m, m_fmed f, vclientes C, vpaciente P, D_TABLAS exa
      WHERE 
        m.ruc_SAB = @ruc 
        AND m.cdg_fmed = f.cdg_fmed 
        AND F.num_dni = P.NUM_DNI 
        AND F.tip_exa = EXA.NUM_ITEM 
        AND EXA.CDG_TAB = 'EXA'
        AND m.ruc_SAB = c.RUC_CLI 
        ${where}
        AND (
          LTRIM(RTRIM(OTD_1)) LIKE 'HIPOACUSIA MIXTA%' 
          OR LTRIM(RTRIM(OTD_2)) LIKE 'HIPOACUSIA MIXTA%' 
          OR LTRIM(RTRIM(OTD_3)) LIKE 'HIPOACUSIA MIXTA%' 
          OR LTRIM(RTRIM(OTD_4)) LIKE 'HIPOACUSIA MIXTA%' 
          OR LTRIM(RTRIM(OTD_5)) LIKE 'HIPOACUSIA MIXTA%'
        )
        union
        SELECT 
        'HIPOACUSIA INDUCIDA POR EL RUIDO' AS categoria, 
        COUNT(*) AS cantidad 
      FROM [dbo].[M_MSABANA] m, m_fmed f, vclientes C, vpaciente P, D_TABLAS exa
      WHERE 
        m.ruc_SAB = @ruc 
        AND m.cdg_fmed = f.cdg_fmed 
        AND F.num_dni = P.NUM_DNI 
        AND F.tip_exa = EXA.NUM_ITEM 
        AND EXA.CDG_TAB = 'EXA'
        AND m.ruc_SAB = c.RUC_CLI 
        ${where}
        AND (
          LTRIM(RTRIM(OTD_1)) LIKE 'HIPOACUSIA INDUCIDA POR EL RUIDO%' 
          OR LTRIM(RTRIM(OTD_2)) LIKE 'HIPOACUSIA INDUCIDA POR EL RUIDO%' 
          OR LTRIM(RTRIM(OTD_3)) LIKE 'HIPOACUSIA INDUCIDA POR EL RUIDO%' 
          OR LTRIM(RTRIM(OTD_4)) LIKE 'HIPOACUSIA INDUCIDA POR EL RUIDO%' 
          OR LTRIM(RTRIM(OTD_5)) LIKE 'HIPOACUSIA INDUCIDA POR EL RUIDO%'
        )
        union
        SELECT 
        'TOTAL' AS categoria, 
        COUNT(*) AS cantidad 
      FROM [dbo].[M_MSABANA] m ,m_fmed f,vclientes C,vpaciente P,D_TABLAS exa
      where ruc_SAB=@ruc and m.cdg_fmed=f.cdg_fmed and (F.num_dni=P.NUM_DNI)and(F.tip_exa=EXA.NUM_ITEM AND EXA.CDG_TAB='EXA')
      and m.ruc_SAB=c.RUC_CLI and f.fec_fmed between @startDate and @endDate`

      query += this.addOptionalFilters(params, queryParams)

      logger.info('query audiometria', query)

      const result = await this.database.queryWithParams<Audiometry>(
        query,
        queryParams
      )

      if (!result.success) {
        return data
      }

      data = result.data

      return data
    } catch (error: unknown) {
      throw error
    }
  }

  async findSpirometry(
    params: StatisticsQueryDTO,
    ruc: string
  ): Promise<Spirometry[]> {
    try {
      let data: Spirometry[] = []

      const queryParams: QueryParams = {
        ruc,
        startDate: params.startDate,
        endDate: params.endDate
      }

      let where = ' AND f.fec_fmed BETWEEN @startDate AND @endDate'
      where += this.addOptionalFilters(params, queryParams)

      let query = `
      SELECT 
        'NORMAL' AS categoria, 
        COUNT(*) AS cantidad 
      FROM [dbo].[M_MSABANA] m, m_fmed f, vclientes C, vpaciente P, D_TABLAS exa
      WHERE 
        m.ruc_SAB = @ruc 
        AND m.cdg_fmed = f.cdg_fmed 
        AND F.num_dni = P.NUM_DNI 
        AND F.tip_exa = EXA.NUM_ITEM 
        AND EXA.CDG_TAB = 'EXA'
        AND m.ruc_SAB = c.RUC_CLI 
        ${where}
        AND (
          LTRIM(RTRIM(ESD_1)) LIKE 'NORMAL' 
          OR LTRIM(RTRIM(ESD_2)) LIKE 'NORMAL' 
          OR LTRIM(RTRIM(ESD_3)) LIKE 'NORMAL' 
          OR LTRIM(RTRIM(ESD_4)) LIKE 'NORMAL' 
          OR LTRIM(RTRIM(ESD_5)) LIKE 'NORMAL'
        )
        union
        SELECT 
        'RESTRICCION' AS categoria, 
        COUNT(*) AS cantidad 
      FROM [dbo].[M_MSABANA] m, m_fmed f, vclientes C, vpaciente P, D_TABLAS exa
      WHERE 
        m.ruc_SAB = @ruc 
        AND m.cdg_fmed = f.cdg_fmed 
        AND F.num_dni = P.NUM_DNI 
        AND F.tip_exa = EXA.NUM_ITEM 
        AND EXA.CDG_TAB = 'EXA'
        AND m.ruc_SAB = c.RUC_CLI 
        ${where}
        AND (
          LTRIM(RTRIM(ESD_1)) LIKE 'RESTRICCION%' 
          OR LTRIM(RTRIM(ESD_2)) LIKE 'RESTRICCION%' 
          OR LTRIM(RTRIM(ESD_3)) LIKE 'RESTRICCION%' 
          OR LTRIM(RTRIM(ESD_4)) LIKE 'RESTRICCION%' 
          OR LTRIM(RTRIM(ESD_5)) LIKE 'RESTRICCION%'
        )
        union
          SELECT 
        'OBSTRUCCIÓN' AS categoria, 
        COUNT(*) AS cantidad 
      FROM [dbo].[M_MSABANA] m, m_fmed f, vclientes C, vpaciente P, D_TABLAS exa
      WHERE 
        m.ruc_SAB = @ruc 
        AND m.cdg_fmed = f.cdg_fmed 
        AND F.num_dni = P.NUM_DNI 
        AND F.tip_exa = EXA.NUM_ITEM 
        AND EXA.CDG_TAB = 'EXA'
        AND m.ruc_SAB = c.RUC_CLI 
        ${where}
        AND (
          LTRIM(RTRIM(ESD_1)) LIKE 'OBSTRUCCIÓN%' 
          OR LTRIM(RTRIM(ESD_2)) LIKE 'OBSTRUCCIÓN%' 
          OR LTRIM(RTRIM(ESD_3)) LIKE 'OBSTRUCCIÓN%' 
          OR LTRIM(RTRIM(ESD_4)) LIKE 'OBSTRUCCIÓN%' 
          OR LTRIM(RTRIM(ESD_5)) LIKE 'OBSTRUCCIÓN%'
        )
        
        union
        SELECT 
        'TOTAL' AS categoria, 
        COUNT(*) AS cantidad 
      FROM [dbo].[M_MSABANA] m, m_fmed f,vclientes C,vpaciente P,D_TABLAS exa
      where ruc_SAB=@ruc and m.cdg_fmed=f.cdg_fmed and (F.num_dni=P.NUM_DNI) and (F.tip_exa=EXA.NUM_ITEM AND EXA.CDG_TAB='EXA')
      and m.ruc_SAB=c.RUC_CLI and f.fec_fmed between @startDate and @endDate`

      query += this.addOptionalFilters(params, queryParams)

      const result = await this.database.queryWithParams<Spirometry>(
        query,
        queryParams
      )

      if (!result.success) {
        return data
      }

      data = result.data

      return data
    } catch (error: unknown) {
      throw error
    }
  }

  async findVisualAcuity(
    params: StatisticsQueryDTO,
    ruc: string
  ): Promise<VisualAcuity[]> {
    try {
      let data: VisualAcuity[] = []

      const queryParams: QueryParams = {
        ruc,
        startDate: params.startDate,
        endDate: params.endDate
      }

      let conditional = 'AND f.fec_fmed BETWEEN @startDate AND @endDate'
      conditional += this.addOptionalFilters(params, queryParams)

      let query = `
      SELECT 
        'EMETROPE' AS categoria, 
        COUNT(*) AS cantidad 
      FROM [dbo].[M_MSABANA] m, m_fmed f, vclientes C, vpaciente P, D_TABLAS exa
      WHERE 
        m.ruc_SAB = @ruc 
        AND m.cdg_fmed = f.cdg_fmed 
        AND F.num_dni = P.NUM_DNI 
        AND F.tip_exa = EXA.NUM_ITEM 
        AND EXA.CDG_TAB = 'EXA'
        AND m.ruc_SAB = c.RUC_CLI 
        ${conditional}
        AND (
          LTRIM(RTRIM(OFD_1)) LIKE 'EMETROPE' 
          OR LTRIM(RTRIM(OFD_2)) LIKE 'EMETROPE' 
          OR LTRIM(RTRIM(OFD_3)) LIKE 'EMETROPE' 
          OR LTRIM(RTRIM(OFD_4)) LIKE 'EMETROPE' 
          OR LTRIM(RTRIM(OFD_5)) LIKE 'EMETROPE'
        )
        union
        SELECT 
        'AMETROPIA' AS categoria, 
        COUNT(*) AS cantidad 
      FROM [dbo].[M_MSABANA] m, m_fmed f, vclientes C, vpaciente P, D_TABLAS exa
      WHERE 
        m.ruc_SAB = @ruc 
        AND m.cdg_fmed = f.cdg_fmed 
        AND F.num_dni = P.NUM_DNI 
        AND F.tip_exa = EXA.NUM_ITEM 
        AND EXA.CDG_TAB = 'EXA'
        AND m.ruc_SAB = c.RUC_CLI 
        ${conditional}
        AND (
          LTRIM(RTRIM(OFD_1)) LIKE 'AMETROPIA%' 
          OR LTRIM(RTRIM(OFD_2)) LIKE 'AMETROPIA%' 
          OR LTRIM(RTRIM(OFD_3)) LIKE 'AMETROPIA%' 
          OR LTRIM(RTRIM(OFD_4)) LIKE 'AMETROPIA%' 
          OR LTRIM(RTRIM(OFD_5)) LIKE 'AMETROPIA%'
        )
        union
          SELECT 
        'PRESBICIA' AS categoria, 
        COUNT(*) AS cantidad 
      FROM [dbo].[M_MSABANA] m, m_fmed f, vclientes C, vpaciente P, D_TABLAS exa
      WHERE 
        m.ruc_SAB = @ruc 
        AND m.cdg_fmed = f.cdg_fmed 
        AND F.num_dni = P.NUM_DNI 
        AND F.tip_exa = EXA.NUM_ITEM 
        AND EXA.CDG_TAB = 'EXA'
        AND m.ruc_SAB = c.RUC_CLI 
        ${conditional}
        AND (
          LTRIM(RTRIM(OFD_1)) LIKE 'PRESBICIA%' 
          OR LTRIM(RTRIM(OFD_2)) LIKE 'PRESBICIA%' 
          OR LTRIM(RTRIM(OFD_3)) LIKE 'PRESBICIA%' 
          OR LTRIM(RTRIM(OFD_4)) LIKE 'PRESBICIA%' 
          OR LTRIM(RTRIM(OFD_5)) LIKE 'PRESBICIA%'
        )
        
        union
        SELECT 
        'TOTAL' AS categoria, 
        COUNT(*) AS cantidad 
      FROM [dbo].[M_MSABANA] m ,m_fmed f,vclientes C,vpaciente P,D_TABLAS exa
      where ruc_SAB=@ruc and m.cdg_fmed=f.cdg_fmed and (F.num_dni=P.NUM_DNI)and(F.tip_exa=EXA.NUM_ITEM AND EXA.CDG_TAB='EXA')
      and m.ruc_SAB=c.RUC_CLI and f.fec_fmed between @startDate and @endDate`

      query += this.addOptionalFilters(params, queryParams)

      const result = await this.database.queryWithParams<VisualAcuity>(
        query,
        queryParams
      )

      if (!result.success) {
        return data
      }

      data = result.data

      return data
    } catch (error: unknown) {
      throw error
    }
  }

  async findOtherConditions(
    params: StatisticsQueryDTO,
    ruc: string
  ): Promise<OtherConditions[]> {
    try {
      let data: OtherConditions[] = []

      const queryParams: QueryParams = {
        ruc,
        startDate: params.startDate,
        endDate: params.endDate
      }

      let conditional = 'AND f.fec_fmed BETWEEN @startDate AND @endDate'
      conditional += this.addOptionalFilters(params, queryParams)

      let query = `
      SELECT 
        'DISCROMATOPSIA' AS categoria, 
        COUNT(*) AS cantidad 
      FROM [dbo].[M_MSABANA] m, m_fmed f, vclientes C, vpaciente P, D_TABLAS exa
      WHERE 
        m.ruc_SAB = @ruc 
        AND m.cdg_fmed = f.cdg_fmed 
        AND F.num_dni = P.NUM_DNI 
        AND F.tip_exa = EXA.NUM_ITEM 
        AND EXA.CDG_TAB = 'EXA'
        AND m.ruc_SAB = c.RUC_CLI 
        ${conditional}
        AND (
          LTRIM(RTRIM(OFD_1)) LIKE 'DISCROMATOPSIA%' 
          OR LTRIM(RTRIM(OFD_2)) LIKE 'DISCROMATOPSIA%' 
          OR LTRIM(RTRIM(OFD_3)) LIKE 'DISCROMATOPSIA%' 
          OR LTRIM(RTRIM(OFD_4)) LIKE 'DISCROMATOPSIA%' 
          OR LTRIM(RTRIM(OFD_5)) LIKE 'DISCROMATOPSIA%'
        )
        union
        SELECT 
        'CICATRIZ CORNEAL' AS categoria, 
        COUNT(*) AS cantidad 
      FROM [dbo].[M_MSABANA] m, m_fmed f, vclientes C, vpaciente P, D_TABLAS exa
      WHERE 
        m.ruc_SAB = @ruc 
        AND m.cdg_fmed = f.cdg_fmed 
        AND F.num_dni = P.NUM_DNI 
        AND F.tip_exa = EXA.NUM_ITEM 
        AND EXA.CDG_TAB = 'EXA'
        AND m.ruc_SAB = c.RUC_CLI 
        ${conditional}
        AND (
          LTRIM(RTRIM(OFD_1)) LIKE 'CICATRIZ CORNEAL%' 
          OR LTRIM(RTRIM(OFD_2)) LIKE 'CICATRIZ CORNEAL%' 
          OR LTRIM(RTRIM(OFD_3)) LIKE 'CICATRIZ CORNEAL%' 
          OR LTRIM(RTRIM(OFD_4)) LIKE 'CICATRIZ CORNEAL%' 
          OR LTRIM(RTRIM(OFD_5)) LIKE 'CICATRIZ CORNEAL%'
        )
        union
          SELECT 
        'ESTEREOPSIS ANORMAL' AS categoria, 
        COUNT(*) AS cantidad 
      FROM [dbo].[M_MSABANA] m, m_fmed f, vclientes C, vpaciente P, D_TABLAS exa
      WHERE 
        m.ruc_SAB = @ruc 
        AND m.cdg_fmed = f.cdg_fmed 
        AND F.num_dni = P.NUM_DNI 
        AND F.tip_exa = EXA.NUM_ITEM 
        AND EXA.CDG_TAB = 'EXA'
        AND m.ruc_SAB = c.RUC_CLI 
        ${conditional}
        AND (
          LTRIM(RTRIM(OFD_1)) LIKE 'ESTEREOPSIS ANORMAL%' 
          OR LTRIM(RTRIM(OFD_2)) LIKE 'ESTEREOPSIS ANORMAL%' 
          OR LTRIM(RTRIM(OFD_3)) LIKE 'ESTEREOPSIS ANORMAL%' 
          OR LTRIM(RTRIM(OFD_4)) LIKE 'ESTEREOPSIS ANORMAL%' 
          OR LTRIM(RTRIM(OFD_5)) LIKE 'ESTEREOPSIS ANORMAL%'
        )
        
        union
            SELECT 
        'PINGUECULA' AS categoria, 
        COUNT(*) AS cantidad 
      FROM [dbo].[M_MSABANA] m, m_fmed f, vclientes C, vpaciente P, D_TABLAS exa
      WHERE 
        m.ruc_SAB = @ruc 
        AND m.cdg_fmed = f.cdg_fmed 
        AND F.num_dni = P.NUM_DNI 
        AND F.tip_exa = EXA.NUM_ITEM 
        AND EXA.CDG_TAB = 'EXA'
        AND m.ruc_SAB = c.RUC_CLI 
        ${conditional}
        AND (
          LTRIM(RTRIM(OFD_1)) LIKE 'PING%' 
          OR LTRIM(RTRIM(OFD_2)) LIKE 'PING%' 
          OR LTRIM(RTRIM(OFD_3)) LIKE 'PING%' 
          OR LTRIM(RTRIM(OFD_4)) LIKE 'PING%' 
          OR LTRIM(RTRIM(OFD_5)) LIKE 'PING%'
        )
        
        union
            SELECT 
        'PTERIGION' AS categoria, 
        COUNT(*) AS cantidad 
      FROM [dbo].[M_MSABANA] m, m_fmed f, vclientes C, vpaciente P, D_TABLAS exa
      WHERE 
        m.ruc_SAB = @ruc 
        AND m.cdg_fmed = f.cdg_fmed 
        AND F.num_dni = P.NUM_DNI 
        AND F.tip_exa = EXA.NUM_ITEM 
        AND EXA.CDG_TAB = 'EXA'
        AND m.ruc_SAB = c.RUC_CLI 
        ${conditional}
        AND (
          LTRIM(RTRIM(OFD_1)) LIKE 'PTERIGION%' 
          OR LTRIM(RTRIM(OFD_2)) LIKE 'PTERIGION%' 
          OR LTRIM(RTRIM(OFD_3)) LIKE 'PTERIGION%' 
          OR LTRIM(RTRIM(OFD_4)) LIKE 'PTERIGION%' 
          OR LTRIM(RTRIM(OFD_5)) LIKE 'PTERIGION%'
        )
        
        union
        SELECT 
        'TOTAL' AS categoria, 
        COUNT(*) AS cantidad 
      FROM [dbo].[M_MSABANA] m ,m_fmed f,vclientes C,vpaciente P,D_TABLAS exa
      where ruc_SAB=@ruc and m.cdg_fmed=f.cdg_fmed and (F.num_dni=P.NUM_DNI)and(F.tip_exa=EXA.NUM_ITEM AND EXA.CDG_TAB='EXA')
      and m.ruc_SAB=c.RUC_CLI and f.fec_fmed between @startDate and @endDate`

      query += this.addOptionalFilters(params, queryParams)

      logger.info('query other conditions', query)

      const result = await this.database.queryWithParams<OtherConditions>(
        query,
        queryParams
      )

      if (!result.success) {
        return data
      }

      data = result.data

      return data
    } catch (error: unknown) {
      throw error
    }
  }

  async findChestXRay(
    params: StatisticsQueryDTO,
    ruc: string
  ): Promise<ChestXRay[]> {
    try {
      let data: ChestXRay[] = []

      const queryParams: QueryParams = {
        ruc,
        startDate: params.startDate,
        endDate: params.endDate
      }

      let conditional = 'AND f.fec_fmed BETWEEN @startDate AND @endDate'
      conditional += this.addOptionalFilters(params, queryParams)

      let query = `
      SELECT 
        'NORMAL' AS categoria, 
        COUNT(*) AS cantidad 
      FROM [dbo].[M_MSABANA] m, m_fmed f, vclientes C, vpaciente P, D_TABLAS exa
      WHERE 
        m.ruc_SAB = @ruc 
        AND m.cdg_fmed = f.cdg_fmed 
        AND F.num_dni = P.NUM_DNI 
        AND F.tip_exa = EXA.NUM_ITEM 
        AND EXA.CDG_TAB = 'EXA'
        AND m.ruc_SAB = c.RUC_CLI 
        ${conditional}
        AND (
          LTRIM(RTRIM(RXD_1)) LIKE 'PULMONES RADIOLOGICAMENTE NORMALES%' 
          OR LTRIM(RTRIM(RXD_2)) LIKE 'PULMONES RADIOLOGICAMENTE NORMALES%' 
          OR LTRIM(RTRIM(RXD_3)) LIKE 'PULMONES RADIOLOGICAMENTE NORMALES%' 
          OR LTRIM(RTRIM(RXD_4)) LIKE 'PULMONES RADIOLOGICAMENTE NORMALES%' 
          OR LTRIM(RTRIM(RXD_5)) LIKE 'PULMONES RADIOLOGICAMENTE NORMALES%'
        )
        union
        SELECT 
        'TOTAL' AS categoria, 
        COUNT(*) AS cantidad 
      FROM [dbo].[M_MSABANA] m ,m_fmed f,vclientes C,vpaciente P,D_TABLAS exa
      where ruc_SAB=@ruc and m.cdg_fmed=f.cdg_fmed and (F.num_dni=P.NUM_DNI)and(F.tip_exa=EXA.NUM_ITEM AND EXA.CDG_TAB='EXA')
      and m.ruc_SAB=c.RUC_CLI and f.fec_fmed between @startDate and @endDate`

      query += this.addOptionalFilters(params, queryParams)

      const result = await this.database.queryWithParams<ChestXRay>(
        query,
        queryParams
      )

      if (!result.success) {
        return data
      }

      data = result.data

      return data
    } catch (error: unknown) {
      throw error
    }
  }

  async findElectrocardiogram(
    params: StatisticsQueryDTO,
    ruc: string
  ): Promise<Electrocardiogram[]> {
    try {
      let data: Electrocardiogram[] = []

      const queryParams: QueryParams = {
        ruc,
        startDate: params.startDate,
        endDate: params.endDate
      }

      let conditional = 'AND f.fec_fmed BETWEEN @startDate AND @endDate'
      conditional += this.addOptionalFilters(params, queryParams)

      let query = `
      SELECT 
        'NORMAL' AS categoria, 
        COUNT(*) AS cantidad 
      FROM [dbo].[M_MSABANA] m, m_fmed f, vclientes C, vpaciente P, D_TABLAS exa
      WHERE 
        m.ruc_SAB = @ruc 
        AND m.cdg_fmed = f.cdg_fmed 
        AND F.num_dni = P.NUM_DNI 
        AND F.tip_exa = EXA.NUM_ITEM 
        AND EXA.CDG_TAB = 'EXA'
        AND m.ruc_SAB = c.RUC_CLI 
        ${conditional}
        AND (
          LTRIM(RTRIM(EKGD_1)) LIKE '%NORMAL%' 
          OR LTRIM(RTRIM(EKGD_2)) LIKE '%NORMAL%' 
          OR LTRIM(RTRIM(EKGD_3)) LIKE '%NORMAL%' 
          OR LTRIM(RTRIM(EKGD_4)) LIKE '%NORMAL%' 
          OR LTRIM(RTRIM(EKGD_5)) LIKE '%NORMAL%'
        )
        
        union
        
        SELECT 
        'TOTAL' AS categoria, 
        COUNT(*) AS cantidad 
      FROM [dbo].[M_MSABANA] m ,m_fmed f,vclientes C,vpaciente P,D_TABLAS exa
      where ruc_SAB=@ruc and m.cdg_fmed=f.cdg_fmed and (F.num_dni=P.NUM_DNI)and(F.tip_exa=EXA.NUM_ITEM AND EXA.CDG_TAB='EXA')
      and m.ruc_SAB=c.RUC_CLI and f.fec_fmed between @startDate and @endDate AND LTRIM(RTRIM(EKGD_1)) <> ''`

      query += this.addOptionalFilters(params, queryParams)

      const result = await this.database.queryWithParams<Electrocardiogram>(
        query,
        queryParams
      )

      if (!result.success) {
        return data
      }

      data = result.data

      return data
    } catch (error: unknown) {
      throw error
    }
  }

  async findPsychology(
    params: StatisticsQueryDTO,
    ruc: string
  ): Promise<Psychology[]> {
    try {
      let data: Psychology[] = []

      const queryParams: QueryParams = {
        ruc,
        startDate: params.startDate,
        endDate: params.endDate
      }

      let conditional = 'AND f.fec_fmed BETWEEN @startDate AND @endDate'
      conditional += this.addOptionalFilters(params, queryParams)

      let query = `
      SELECT 
        'APTO' AS categoria, 
        COUNT(*) AS cantidad 
      FROM [dbo].[M_MSABANA] m, m_fmed f, vclientes C, vpaciente P, D_TABLAS exa
      WHERE 
        m.ruc_SAB = @ruc 
        AND m.cdg_fmed = f.cdg_fmed 
        AND F.num_dni = P.NUM_DNI 
        AND F.tip_exa = EXA.NUM_ITEM 
        AND EXA.CDG_TAB = 'EXA'
        AND m.ruc_SAB = c.RUC_CLI 
        ${conditional}
        AND (
          LTRIM(RTRIM(PSD_1)) LIKE 'APTO%' 
          OR LTRIM(RTRIM(PSD_2)) LIKE 'APTO%' 
          OR LTRIM(RTRIM(PSD_3)) LIKE 'APTO%' 
          OR LTRIM(RTRIM(PSD_4)) LIKE 'APTO%' 
          OR LTRIM(RTRIM(PSD_5)) LIKE 'APTO%'
        )
        union
        SELECT 
        'TOTAL' AS categoria, 
        COUNT(*) AS cantidad 
      FROM [dbo].[M_MSABANA] m ,m_fmed f,vclientes C,vpaciente P,D_TABLAS exa
      where ruc_SAB=@ruc and m.cdg_fmed=f.cdg_fmed and (F.num_dni=P.NUM_DNI)and(F.tip_exa=EXA.NUM_ITEM AND EXA.CDG_TAB='EXA')
      and m.ruc_SAB=c.RUC_CLI and f.fec_fmed between @startDate and @endDate AND LTRIM(RTRIM(PSD_1)) <> ''`

      query += this.addOptionalFilters(params, queryParams)

      logger.info('query psychology', query)

      const result = await this.database.queryWithParams<Psychology>(
        query,
        queryParams
      )

      if (!result.success) {
        return data
      }

      data = result.data

      return data
    } catch (error: unknown) {
      throw error
    }
  }

  async findStructuralHeight(
    params: StatisticsQueryDTO,
    ruc: string
  ): Promise<StructuralHeight[]> {
    try {
      let data: StructuralHeight[] = []

      const queryParams: QueryParams = {
        ruc,
        startDate: params.startDate,
        endDate: params.endDate
      }

      let conditional = 'AND f.fec_fmed BETWEEN @startDate AND @endDate'
      conditional += this.addOptionalFilters(params, queryParams)

      const query = `
      SELECT 
        'APTO' AS categoria, 
        COUNT(*) AS cantidad 
      FROM [dbo].[M_MSABANA] m, m_fmed f, vclientes C, vpaciente P, D_TABLAS exa
      WHERE 
        m.ruc_SAB = @ruc 
        AND m.cdg_fmed = f.cdg_fmed 
        AND F.num_dni = P.NUM_DNI 
        AND F.tip_exa = EXA.NUM_ITEM 
        AND EXA.CDG_TAB = 'EXA'
        AND m.ruc_SAB = c.RUC_CLI 
        ${conditional}
        AND (
          LTRIM(RTRIM(F.opcaptitu)) = 1
        OR LTRIM(RTRIM(F.opc_altoriesgo)) = 1 
        )
        union
        SELECT 
        'NO APTO' AS categoria, 
        COUNT(*) AS cantidad 
      FROM [dbo].[M_MSABANA] m, m_fmed f, vclientes C, vpaciente P, D_TABLAS exa
      WHERE 
        m.ruc_SAB = @ruc 
        AND m.cdg_fmed = f.cdg_fmed 
        AND F.num_dni = P.NUM_DNI 
        AND F.tip_exa = EXA.NUM_ITEM 
        AND EXA.CDG_TAB = 'EXA'
        AND m.ruc_SAB = c.RUC_CLI 
        ${conditional}
        AND (
          LTRIM(RTRIM(F.opcaptitu)) = 2
        OR LTRIM(RTRIM(F.opc_altoriesgo)) = 2)`

      const result = await this.database.queryWithParams<StructuralHeight>(
        query,
        queryParams
      )

      if (!result.success) {
        return data
      }

      data = result.data

      return data
    } catch (error: unknown) {
      throw error
    }
  }

  async findOdontology(
    params: StatisticsQueryDTO,
    ruc: string
  ): Promise<Odontology[]> {
    try {
      let data: Odontology[] = []

      const queryParams: QueryParams = {
        ruc,
        startDate: params.startDate,
        endDate: params.endDate
      }

      let conditional = 'AND f.fec_fmed BETWEEN @startDate AND @endDate'
      conditional += this.addOptionalFilters(params, queryParams)

      let query = `
      SELECT 
        'CARIES DENTAL' AS categoria, 
        COUNT(*) AS cantidad 
      FROM [dbo].[M_MSABANA] m, m_fmed f, vclientes C, vpaciente P, D_TABLAS exa
      WHERE 
        m.ruc_SAB = @ruc 
        AND m.cdg_fmed = f.cdg_fmed 
        AND F.num_dni = P.NUM_DNI 
        AND F.tip_exa = EXA.NUM_ITEM 
        AND EXA.CDG_TAB = 'EXA'
        AND m.ruc_SAB = c.RUC_CLI 
        ${conditional}
        AND (
          LTRIM(RTRIM(ODOD_1)) LIKE 'CARIES DENTAL%' 
          OR LTRIM(RTRIM(ODOD_2)) LIKE 'CARIES DENTAL%' 
          OR LTRIM(RTRIM(ODOD_3)) LIKE 'CARIES DENTAL%' 
          OR LTRIM(RTRIM(ODOD_4)) LIKE 'CARIES DENTAL%' 
          OR LTRIM(RTRIM(ODOD_5)) LIKE 'CARIES DENTAL%'
        )
        union
        SELECT 
        'SIN CARIES' AS categoria, 
        COUNT(*) AS cantidad 
      FROM [dbo].[M_MSABANA] m, m_fmed f, vclientes C, vpaciente P, D_TABLAS exa
      WHERE 
        m.ruc_SAB = @ruc 
        AND m.cdg_fmed = f.cdg_fmed 
        AND F.num_dni = P.NUM_DNI 
        AND F.tip_exa = EXA.NUM_ITEM 
        AND EXA.CDG_TAB = 'EXA'
        AND m.ruc_SAB = c.RUC_CLI 
        ${conditional}
        AND (
          LTRIM(RTRIM(ODOD_1)) LIKE 'SIN CARIES%' 
          OR LTRIM(RTRIM(ODOD_2)) LIKE 'SIN CARIES%' 
          OR LTRIM(RTRIM(ODOD_3)) LIKE 'SIN CARIES%' 
          OR LTRIM(RTRIM(ODOD_4)) LIKE 'SIN CARIES%' 
          OR LTRIM(RTRIM(ODOD_5)) LIKE 'SIN CARIES%'
        )
        union
          SELECT 
        'GINGIVITIS' AS categoria, 
        COUNT(*) AS cantidad 
      FROM [dbo].[M_MSABANA] m, m_fmed f, vclientes C, vpaciente P, D_TABLAS exa
      WHERE 
        m.ruc_SAB = @ruc 
        AND m.cdg_fmed = f.cdg_fmed 
        AND F.num_dni = P.NUM_DNI 
        AND F.tip_exa = EXA.NUM_ITEM 
        AND EXA.CDG_TAB = 'EXA'
        AND m.ruc_SAB = c.RUC_CLI 
        ${conditional}
        AND (
          LTRIM(RTRIM(ODOD_1)) LIKE 'GINGIVITIS%' 
          OR LTRIM(RTRIM(ODOD_2)) LIKE 'GINGIVITIS%' 
          OR LTRIM(RTRIM(ODOD_3)) LIKE 'GINGIVITIS%' 
          OR LTRIM(RTRIM(ODOD_4)) LIKE 'GINGIVITIS%' 
          OR LTRIM(RTRIM(ODOD_5)) LIKE 'GINGIVITIS%'
        )
        
        union
            SELECT 
        'NECROSIS DE LA PULPA' AS categoria, 
        COUNT(*) AS cantidad 
      FROM [dbo].[M_MSABANA] m, m_fmed f, vclientes C, vpaciente P, D_TABLAS exa
      WHERE 
        m.ruc_SAB = @ruc 
        AND m.cdg_fmed = f.cdg_fmed 
        AND F.num_dni = P.NUM_DNI 
        AND F.tip_exa = EXA.NUM_ITEM 
        AND EXA.CDG_TAB = 'EXA'
        AND m.ruc_SAB = c.RUC_CLI 
        ${conditional}
        AND (
          LTRIM(RTRIM(ODOD_1)) LIKE 'NECROSIS DE LA PULPA%' 
          OR LTRIM(RTRIM(ODOD_2)) LIKE 'NECROSIS DE LA PULPA%' 
          OR LTRIM(RTRIM(ODOD_3)) LIKE 'NECROSIS DE LA PULPA%' 
          OR LTRIM(RTRIM(ODOD_4)) LIKE 'NECROSIS DE LA PULPA%' 
          OR LTRIM(RTRIM(ODOD_5)) LIKE 'NECROSIS DE LA PULPA%'
        )
        
        union
            SELECT 
        'PULPITIS' AS categoria, 
        COUNT(*) AS cantidad 
      FROM [dbo].[M_MSABANA] m, m_fmed f, vclientes C, vpaciente P, D_TABLAS exa
      WHERE 
        m.ruc_SAB = @ruc 
        AND m.cdg_fmed = f.cdg_fmed 
        AND F.num_dni = P.NUM_DNI 
        AND F.tip_exa = EXA.NUM_ITEM 
        AND EXA.CDG_TAB = 'EXA'
        AND m.ruc_SAB = c.RUC_CLI 
        ${conditional}
        AND (
          LTRIM(RTRIM(ODOD_1)) LIKE 'PULPITIS%' 
          OR LTRIM(RTRIM(ODOD_2)) LIKE 'PULPITIS%' 
          OR LTRIM(RTRIM(ODOD_3)) LIKE 'PULPITIS%' 
          OR LTRIM(RTRIM(ODOD_4)) LIKE 'PULPITIS%' 
          OR LTRIM(RTRIM(ODOD_5)) LIKE 'PULPITIS%'
        )
        
        union
        SELECT 
        'TOTAL' AS categoria, 
        COUNT(*) AS cantidad 
      FROM [dbo].[M_MSABANA] m ,m_fmed f,vclientes C,vpaciente P,D_TABLAS exa
      where ruc_SAB=@ruc and m.cdg_fmed=f.cdg_fmed and (F.num_dni=P.NUM_DNI)and(F.tip_exa=EXA.NUM_ITEM AND EXA.CDG_TAB='EXA')
      and m.ruc_SAB=c.RUC_CLI and f.fec_fmed between @startDate and @endDate AND LTRIM(RTRIM(ODOD_1)) <> ''`

      query += this.addOptionalFilters(params, queryParams)

      logger.info('query odontology', query)

      const result = await this.database.queryWithParams<Odontology>(
        query,
        queryParams
      )

      if (!result.success) {
        return data
      }

      data = result.data

      return data
    } catch (error: unknown) {
      throw error
    }
  }

  async check(params: StatisticsQueryDTO, ruc: string): Promise<boolean> {
    try {
      if (!params.startDate || !params.endDate) {
        return false
      }

      const queryParams: QueryParams = {
        ruc,
        startDate: params.startDate,
        endDate: params.endDate
      }

      let query = `
      SELECT count(m.cdg_fmed) as cantidad FROM M_MSABANA m, m_fmed f WHERE m.cdg_fmed=f.cdg_fmed and m.ruc_SAB=@ruc`
      query += ' AND f.fec_fmed between @startDate and @endDate'

      if (params.examType) {
        query += ' AND F.tip_exa=@examType'
        queryParams.examType = params.examType
      }

      if (params.headquarter) {
        query += ' AND f.cdg_sede=@headquarter'
        queryParams.headquarter = params.headquarter
      }

      const result = await this.database.queryWithParams<{ cantidad: number }>(
        query,
        queryParams
      )

      if (!result.success) {
        return false
      }

      logger.info(`Statistics check: ${JSON.stringify(result.data)}`)

      return result.data[0].cantidad > 0 ? true : false
    } catch (error: unknown) {
      throw error
    }
  }
}
