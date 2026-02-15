import { EpidemiologicalReport } from '../../medical-exams/repository/entity'
import {
  DB_HOST,
  DB_INSTANCE,
  DB_NAME,
  DB_PASS,
  DB_USER,
  Database,
  logger,
} from '../../shared'
import { ExamType } from './entity/examType'
import { Headquarter } from './entity/headquarter'
import { User } from './entity/user'
import { ICommonsRepository } from './interfaces/commons.repository.interface'

export default class CommonsRepository implements ICommonsRepository {
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
        instanceName: DB_INSTANCE,
      },
    })
  }

  async findAllHeadquarters(): Promise<Headquarter[]> {
    let data: Headquarter[] = []

    try {
      const query = 'SELECT LTRIM(RTRIM(d_tablas.des_item)) AS nombre_sede, d_tablas.num_item AS cod_sede FROM d_tablas WHERE cdg_tab = \'SDT\' AND swt_item = 1 ORDER BY nombre_sede'

      const result = await this.database.query<Headquarter>(query)

      if (!result.success) {
        return data
      }

      data = result.data

      return data
    } catch (error: unknown) {
      throw error
    }
  }

  async findAllExamTypes(): Promise<ExamType[]> {
    let data: ExamType[] = []

    try {
      const query = 'SELECT LTRIM(RTRIM(des_item)) AS des_item, num_item AS cod_item FROM d_tablas WHERE cdg_tab=\'EXA\' AND swt_item=1 ORDER BY des_item'

      const result = await this.database.query<ExamType>(query)

      if (!result.success) {
        return data
      }

      data = result.data

      return data
    } catch (error: unknown) {
      throw error
    }
  }

  async findEpidemiologicalReport(
    ruc: string,
  ): Promise<EpidemiologicalReport[]> {
    try {
      const query = `select cdg_reg,periodo,tipo from m_informe_ipidemiologico where ruc_cli='${ruc}'`

      const result = await this.database.query<EpidemiologicalReport>(query)

      if (!result.success) {
        return []
      }

      return result.data
    } catch (error: unknown) {
      throw error
    }
  }

  async uploadPhoto(photoURL: string, dni: string): Promise<boolean> {
    try {
      const query = `UPDATE m_User_Intranet SET usr_foto='${photoURL}' WHERE dni='${dni}'`

      logger.info(`Updating photo for user: ${dni} | Photo: ${photoURL} init`)

      const result = await this.database.query<User>(query)

      logger.info(
        `Updating photo for user: ${dni} | Photo: ${photoURL} end | Result: ${result.data}`,
      )

      if (!result.success) {
        return false
      }

      return true
    } catch (error: unknown) {
      throw error
    }
  }
}

