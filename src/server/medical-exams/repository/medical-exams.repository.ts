import {
  DB_HOST,
  DB_NAME,
  DB_PASS,
  DB_USER,
  DB_INSTANCE,
  Database,
  QueryParams,
  logger
} from '../../shared'
import { MedicalExamsQueryDTO } from '../dto/medical-exams-query.dto'
import { Consultations, EpidemiologicalReport, Recommendations } from './entity'
import { MedicalExams } from './entity/medical-exams'
import { MedicalRecord } from './entity/medical-record'
import { IMedicalExamsRepository } from './interfaces/medical-exams.repository.interface'

export default class MedicalExamsRepository implements IMedicalExamsRepository {
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

  async findAll(
    params: MedicalExamsQueryDTO,
    ruc: string
  ): Promise<MedicalExams[]> {
    try {
      // const query = `SELECT ficha.cdg_fmed, CONVERT(varchar(10), CONVERT(date,ficha.fec_fmed, 106), 103) as fec_fmed, ficha.tip_exa AS cod_t_examen, LTRIM(RTRIM(EXA.DES_ITEM)) AS t_examen, LTRIM(RTRIM(ficha.num_dni)) AS num_dni, LTRIM(RTRIM(paci.NOMBRE_PERSONA)) AS nombres, LTRIM(RTRIM(paci.APELLIDO_PERSONA)) AS apellidos FROM m_fmed ficha,vclientes mc,D_TABLAS EXA,vpaciente paci WHERE ficha.num_dni='${params.dni}'and PACI.APELLIDO_PERSONA LIKE '%${params.fullName}%' AND FICHA.fec_fmed BETWEEN '${params.fec_ini}' AND '${params.fec_fin}' AND FICHA.tip_exa='${params.t_examen}' AND FICHA.cdg_sede='${params.sede}' AND ficha.ruc_cli = mc.ruc_cli AND ficha.ruc_cli='${params.ruc}' AND (ficha.tip_Exa = EXA.NUM_ITEM AND EXA.cdg_tab='EXA') AND (ficha.NUM_DNI = paci.NUM_DNI AND ficha.cdg_tdoc = paci.cdg_tdoc)`;

      // let query = `SELECT ficha.cdg_fmed, CONVERT(varchar(10), CONVERT(date,ficha.fec_fmed, 106), 103) as fec_fmed, ficha.tip_exa AS cod_t_examen, LTRIM(RTRIM(EXA.DES_ITEM)) AS t_examen, LTRIM(RTRIM(ficha.num_dni)) AS num_dni, LTRIM(RTRIM(paci.NOMBRE_PERSONA)) AS nombres, LTRIM(RTRIM(paci.APELLIDO_PERSONA)) AS apellidos, CASE APTITUD WHEN 1 THEN 'APTO' WHEN 2 THEN 'APTO CON RESTRICCIONES' WHEN 3 THEN 'NO APTO' WHEN 4 THEN 'OBSERVADO' ELSE ' ' END as aptitud FROM m_fmed ficha,vclientes mc,D_TABLAS EXA,vpaciente paci WHERE ficha.ruc_cli = mc.ruc_cli AND ficha.ruc_cli='${ruc}' AND (ficha.tip_Exa = EXA.NUM_ITEM AND EXA.cdg_tab='EXA') AND (ficha.NUM_DNI = paci.NUM_DNI AND ficha.cdg_tdoc = paci.cdg_tdoc) AND FICHA.EWEB=1 AND ficha.tip_exa <>'004'`;

      let query = `SELECT ficha.chkproceso, ficha.cdg_fmed, ficha.EWEB AS close_status, ficha.cdg_sede, CONVERT(varchar(10), CONVERT(date,ficha.fec_fmed, 106), 103) as fec_fmed, ficha.tip_exa AS cod_t_examen, RTRIM(LTRIM(mc.DES_CLI)) AS empresa, LTRIM(RTRIM(EXA.DES_ITEM)) AS t_examen, LTRIM(RTRIM(ficha.num_dni)) AS num_dni, LTRIM(RTRIM(paci.NOMBRE_PERSONA)) AS nombres, LTRIM(RTRIM(paci.APELLIDO_PERSONA)) AS apellidos, CASE APTITUD WHEN 1 THEN 'APTO' WHEN 2 THEN 'APTO CON RESTRICCIONES' WHEN 3 THEN 'NO APTO' WHEN 4 THEN 'OBSERVADO' ELSE ' ' END as aptitud FROM m_fmed ficha, vclientes mc,D_TABLAS EXA,vpaciente paci WHERE ficha.ruc_cli = mc.ruc_cli AND ficha.ruc_cli=@ruc AND (ficha.tip_Exa = EXA.NUM_ITEM AND EXA.cdg_tab='EXA') AND (ficha.NUM_DNI = paci.NUM_DNI AND ficha.cdg_tdoc = paci.cdg_tdoc) AND ficha.tip_exa <>'004'`
      const queryParams: QueryParams = { ruc }

      if (params.dni) {
        query += ' AND ficha.num_dni=@dni'
        queryParams.dni = params.dni
      }

      if (params.lastName) {
        query += ' AND PACI.APELLIDO_PERSONA LIKE @lastName'
        queryParams.lastName = `%${params.lastName}%`
      }

      if (params.startDate && params.endDate) {
        query += ' AND FICHA.fec_fmed BETWEEN @startDate AND @endDate'
        queryParams.startDate = params.startDate
        queryParams.endDate = params.endDate
      }

      if (params.examType) {
        query += ' AND FICHA.tip_exa=@examType'
        queryParams.examType = params.examType
      }

      if (params.sede) {
        query += ' AND FICHA.cdg_sede=@sede'
        queryParams.sede = params.sede
      }

      query += ' ORDER BY CONVERT(date, ficha.fec_fmed, 106) DESC;'

      const result = await this.database.queryWithParams<MedicalExams>(
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

  async findByDNI(dni: string, ruc: string): Promise<MedicalExams[]> {
    try {
      const query = `SELECT ficha.cdg_fmed, Convert(varchar(10), CONVERT(date,ficha.fec_fmed,106),103) as fec_fmed, ficha.tip_exa AS cod_t_examen, LTRIM(RTRIM(EXA.DES_ITEM)) AS t_examen,LTRIM(RTRIM(ficha.num_dni)) AS num_dni, LTRIM(RTRIM(paci.NOMBRE_PERSONA)) AS nombres, LTRIM(RTRIM(paci.APELLIDO_PERSONA)) AS apellidos From m_fmed ficha,vclientes mc,D_TABLAS EXA,vpaciente paci  WHERE ficha.num_dni=@dni and ficha.ruc_cli = mc.ruc_cli AND ficha.ruc_cli=@ruc AND FICHA.EWEB=1 AND ficha.tip_exa <>'004' AND (ficha.tip_Exa = EXA.NUM_ITEM AND EXA.cdg_tab='EXA') AND (ficha.NUM_DNI = paci.NUM_DNI AND ficha.cdg_tdoc = paci.cdg_tdoc ) ORDER BY CONVERT(date, ficha.fec_fmed, 106) DESC;`

      const result = await this.database.queryWithParams<MedicalExams>(query, {
        dni,
        ruc
      })

      if (!result.success) {
        return []
      }

      return result.data
    } catch (error: unknown) {
      throw error
    }
  }

  async findBySede(sede: string, ruc: string): Promise<MedicalExams[]> {
    try {
      const query = `Select ficha.cdg_fmed,Convert(varchar(10),CONVERT(date,ficha.fec_fmed,106),103) as fec_fmed, ficha.tip_exa AS cod_t_examen,LTRIM(RTRIM(EXA.DES_ITEM)) AS t_examen, LTRIM(RTRIM(ficha.num_dni)) AS num_dni, LTRIM(RTRIM(paci.NOMBRE_PERSONA)) AS nombres, LTRIM(RTRIM(paci.APELLIDO_PERSONA)) AS apellidos FROM m_fmed ficha,vclientes mc,D_TABLAS EXA,vpaciente paci  Where FICHA.cdg_sede=@sede and ficha.ruc_cli = mc.ruc_cli AND ficha.ruc_cli=@ruc AND FICHA.EWEB=1 AND (ficha.tip_Exa = EXA.NUM_ITEM AND EXA.cdg_tab='EXA') AND (ficha.NUM_DNI = paci.NUM_DNI AND ficha.cdg_tdoc = paci.cdg_tdoc ) ORDER BY CONVERT(date, ficha.fec_fmed, 106) DESC;`

      const result = await this.database.queryWithParams<MedicalExams>(query, {
        sede,
        ruc
      })

      if (!result.success) {
        return []
      }

      return result.data
    } catch (error: unknown) {
      throw error
    }
  }

  async findByExamType(examType: string, ruc: string): Promise<MedicalExams[]> {
    try {
      const query = `Select ficha.cdg_fmed,Convert(varchar(10),CONVERT(date,ficha.fec_fmed,106),103) as fec_fmed, ficha.tip_exa AS cod_t_examen, LTRIM(RTRIM(EXA.DES_ITEM)) AS t_examen, LTRIM(RTRIM(ficha.num_dni)) AS num_dni, LTRIM(RTRIM(paci.NOMBRE_PERSONA)) AS nombres, LTRIM(RTRIM(paci.APELLIDO_PERSONA)) AS apellidos From m_fmed ficha,vclientes mc,D_TABLAS EXA,vpaciente paci  Where FICHA.tip_exa=@examType and ficha.ruc_cli = mc.ruc_cli AND ficha.ruc_cli=@ruc AND FICHA.EWEB=1 AND ficha.tip_exa <>'004' AND (ficha.tip_Exa = EXA.NUM_ITEM AND EXA.cdg_tab='EXA') AND (ficha.NUM_DNI = paci.NUM_DNI AND ficha.cdg_tdoc = paci.cdg_tdoc ) ORDER BY CONVERT(date, ficha.fec_fmed, 106) DESC;`

      const result = await this.database.queryWithParams<MedicalExams>(query, {
        examType,
        ruc
      })

      if (!result.success) {
        return []
      }

      return result.data
    } catch (error: unknown) {
      throw error
    }
  }

  async findByFichaMedica(fichaMedica: string): Promise<MedicalRecord[]> {
    try {
      const query = `SELECT ficha.cdg_fmed,Convert(varchar(10),CONVERT(date,ficha.fec_fmed,106),103) as fec_fmed,ficha.tip_exa AS cod_tip_examen, LTRIM(RTRIM(EXA.DES_ITEM)) AS tipo_examen,LTRIM(RTRIM(ficha.num_dni)) AS num_dni, LTRIM(RTRIM(paci.NOMBRE_PERSONA)) AS nombres, LTRIM(RTRIM(paci.APELLIDO_PERSONA)) AS apellidos, ficha.talla ,ficha.resp ,ficha.abd ,ficha.peso ,ficha.card ,ficha.cadera, ficha.imc  ,ficha.icc ,ficha.satoxi ,ficha.temp,FICHA.pamm,FICHA.PS AS ps,(select isnull((select resultado from d_labo where cdg_exa=2 and  cdg_fmed=ficha.cdg_fmed),'-') ) as hemoglobina,(select (isnull((select resultado from d_labo where cdg_exa=16 and cdg_fmed=ficha.cdg_fmed),isnull((select resultado from d_labo where cdg_exa=22 and cdg_fmed=ficha.cdg_fmed),'-')))) as colesterol,(select(isnull((select resultado from d_labo where cdg_exa=17 and cdg_fmed=ficha.cdg_fmed),isnull((select resultado from d_labo where cdg_exa=111 and cdg_fmed=ficha.cdg_fmed),'-')))) as trigliceridos,(select isnull((select resultado from d_labo where cdg_exa=14 and cdg_fmed=ficha.cdg_fmed),'-')) as glucosa FROM m_fmed ficha,vclientes mc,D_TABLAS EXA,vpaciente paci  WHERE ficha.cdg_fmed=@fichaMedica and ficha.ruc_cli = mc.ruc_cli AND (ficha.tip_Exa = EXA.NUM_ITEM AND EXA.cdg_tab='EXA') AND (ficha.NUM_DNI = paci.NUM_DNI AND ficha.cdg_tdoc = paci.cdg_tdoc)`

      const result = await this.database.queryWithParams<MedicalRecord>(
        query,
        {
          fichaMedica
        }
      )

      if (!result.success) {
        return []
      }

      return result.data
    } catch (error: unknown) {
      throw error
    }
  }

  async findByDates(
    startDate: string,
    endDate: string,
    ruc: string
  ): Promise<MedicalExams[]> {
    try {
      const query = `SELECT ficha.cdg_fmed,Convert(varchar(10),CONVERT(date,ficha.fec_fmed,106),103) AS fec_fmed, ficha.tip_exa AS cod_t_examen, LTRIM(RTRIM(EXA.DES_ITEM)) AS t_examen, LTRIM(RTRIM(ficha.num_dni)) AS num_dni, LTRIM(RTRIM(paci.NOMBRE_PERSONA)) AS nombres, LTRIM(RTRIM(paci.APELLIDO_PERSONA)) AS apellidos FROM m_fmed ficha,vclientes mc,D_TABLAS EXA,vpaciente paci WHERE FICHA.fec_fmed BETWEEN @startDate AND @endDate and ficha.ruc_cli = mc.ruc_cli AND ficha.ruc_cli=@ruc AND FICHA.EWEB=1 AND ficha.tip_exa <>'004' AND (ficha.tip_Exa = EXA.NUM_ITEM AND EXA.cdg_tab='EXA') AND (ficha.NUM_DNI = paci.NUM_DNI AND ficha.cdg_tdoc = paci.cdg_tdoc ) ORDER BY CONVERT(date, ficha.fec_fmed, 106) DESC;`

      const result = await this.database.queryWithParams<MedicalExams>(query, {
        startDate,
        endDate,
        ruc
      })

      if (!result.success) {
        return []
      }

      return result.data
    } catch (error: unknown) {
      throw error
    }
  }

  async findByLastName(lastName: string, ruc: string): Promise<MedicalExams[]> {
    try {
      const query = `Select ficha.cdg_fmed,Convert(varchar(10),CONVERT(date,ficha.fec_fmed,106),103) as fec_fmed, ficha.tip_exa AS cod_t_examen,LTRIM(RTRIM(EXA.DES_ITEM)) AS t_examen, LTRIM(RTRIM(ficha.num_dni)) AS num_dni, LTRIM(RTRIM(paci.NOMBRE_PERSONA)) AS nombres, LTRIM(RTRIM(paci.APELLIDO_PERSONA)) AS apellidos  From m_fmed ficha,vclientes mc,D_TABLAS EXA,vpaciente paci  Where PACI.APELLIDO_PERSONA LIKE @lastName and ficha.ruc_cli = mc.ruc_cli AND ficha.ruc_cli=@ruc AND FICHA.EWEB=1 and ficha.tip_exa <>'004' AND (ficha.tip_Exa = EXA.NUM_ITEM AND EXA.cdg_tab='EXA') AND (ficha.NUM_DNI = paci.NUM_DNI AND ficha.cdg_tdoc = paci.cdg_tdoc) ORDER BY CONVERT(date, ficha.fec_fmed, 106) DESC;`

      const result = await this.database.queryWithParams<MedicalExams>(query, {
        lastName: `%${lastName}%`,
        ruc
      })

      if (!result.success) {
        return []
      }

      return result.data
    } catch (error: unknown) {
      throw error
    }
  }

  async findByDNIAndDates(dni: string): Promise<MedicalExams[]> {
    try {
      // const query = `SELECT ficha.cdg_fmed, Convert(varchar(10), CONVERT(date,ficha.fec_fmed,106),103) as fec_fmed, ficha.tip_exa AS cod_t_examen, LTRIM(RTRIM(EXA.DES_ITEM)) AS t_examen,LTRIM(RTRIM(ficha.num_dni)) AS num_dni, LTRIM(RTRIM(paci.NOMBRE_PERSONA)) AS nombres, LTRIM(RTRIM(paci.APELLIDO_PERSONA)) AS apellidos From m_fmed ficha,vclientes mc,D_TABLAS EXA,vpaciente paci  WHERE ficha.num_dni='${dni}'and ficha.ruc_cli = mc.ruc_cli AND ficha.ruc_cli='${ruc}' AND FICHA.EWEB=1 AND ficha.tip_exa <>'004' AND (ficha.tip_Exa = EXA.NUM_ITEM AND EXA.cdg_tab='EXA') AND (ficha.NUM_DNI = paci.NUM_DNI AND ficha.cdg_tdoc = paci.cdg_tdoc ) ORDER BY CONVERT(date, ficha.fec_fmed, 106) DESC;`;

      const query = `SELECT ficha.cdg_fmed,Convert(varchar(10),CONVERT(date,ficha.fec_fmed,106),103) as fec_fmed,ficha.tip_exa AS cod_t_examen,LTRIM(RTRIM(EXA.DES_ITEM)) AS t_examen,c.DES_CLI AS empresa,LTRIM(RTRIM(ficha.num_dni)) AS num_dni, LTRIM(RTRIM(paci.NOMBRE_PERSONA)) AS nombres, LTRIM(RTRIM(paci.APELLIDO_PERSONA)) AS apellidos, CASE ficha.APTITUD WHEN 1 THEN 'APTO' WHEN 2 THEN 'APTO CON RESTRICCIONES' WHEN 3 THEN 'NO APTO' WHEN 4 THEN 'OBSERVADO' ELSE ' ' END as aptitud FROM m_fmed ficha,vclientes mc,D_TABLAS EXA,vpaciente paci,vclientes c  Where ficha.num_dni=@dni and ficha.ruc_cli = mc.ruc_cli AND  FICHA.EWEB=1 and ficha.tip_exa <>'004'and ficha.ruc_cli=c.RUC_CLI AND (ficha.tip_Exa = EXA.NUM_ITEM AND EXA.cdg_tab='EXA') AND (ficha.NUM_DNI = paci.NUM_DNI AND ficha.cdg_tdoc = paci.cdg_tdoc )`

      const result = await this.database.queryWithParams<MedicalExams>(query, {
        dni
      })

      if (!result.success) {
        return []
      }

      return result.data
    } catch (error: unknown) {
      throw error
    }
  }

  async findConsultations(uid: string): Promise<Consultations[]> {
    try {
      logger.info(`MedicalExamsRepository.findConsultations: ${uid}`)

      const query = `
      select cdg_reg as num_interconsulta,fec_reg,especialidad, mot_interconsulta as motivo,case estado when 1 then 'PENDIENTE' WHEN 2 THEN 'CERRADO'WHEN 3 THEN 'OBSERVADO'ELSE '' END AS estado, CASE TIPO WHEN 1 THEN 'ESPECIALIDAD' WHEN 2 THEN 'VIGILANCIA MEDICA' ELSE '' END AS tipo from m_interconsulta where cdg_fmed=@uid ORDER BY 2,1
      `

      // const query = `
      // select cdg_reg as num_interconsulta, fec_reg, LTRIM(RTRIM(especialidad)) AS especialidad, mot_interconsulta as motivo, case estado when 1 then 'PENDIENTE' WHEN 2 THEN 'CERRADO' WHEN 3 THEN 'OBSERVADO' ELSE '' END AS estado, CASE TIPO WHEN 1 THEN 'ESPECIALIDAD' WHEN 2 THEN 'VIGILANCIA MEDICA' ELSE '' END AS tipo from m_interconsulta ORDER BY 2,1`;

      const result = await this.database.queryWithParams<Consultations>(query, {
        uid
      })

      if (!result.success) {
        return []
      }

      return result.data
    } catch (error: unknown) {
      throw error
    }
  }

  async findRecommendations(cdg_fmed: string): Promise<Recommendations[]> {
    try {
      const query =
        'select cdg_reg, descripcion, cdg_fmed from m_recomendaciones where cdg_fmed=@cdg_fmed'

      const result = await this.database.queryWithParams<Recommendations>(
        query,
        {
          cdg_fmed
        }
      )

      if (!result.success) {
        return []
      }

      return result.data
    } catch (error: unknown) {
      throw error
    }
  }

  async findEpidemiologicalReport(
    ruc: string
  ): Promise<EpidemiologicalReport[]> {
    try {
      const query =
        'select cdg_reg,periodo,tipo from m_informe_ipidemiologico where ruc_cli=@ruc'

      const result = await this.database.queryWithParams<EpidemiologicalReport>(
        query,
        {
          ruc
        }
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
