import {
  DB_HOST,
  DB_INSTANCE,
  DB_NAME,
  DB_PASS,
  DB_USER,
  Database,
} from '../../shared'
import { IPatientRepository } from './interfaces/patient.repository.interface'

export default class PatientRepository implements IPatientRepository {
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

  async getMedicalDetails(fichaMedica: string): Promise<object> {
    try {
      const query = `SELECT ficha.cdg_fmed,Convert(varchar(10),CONVERT(date,ficha.fec_fmed,106),103) as fec_fmed,ficha.tip_exa AS cod_tip_examen, LTRIM(RTRIM(EXA.DES_ITEM)) AS tipo_examen,ficha.num_dni, LTRIM(RTRIM(paci.NOMBRE_PERSONA)) AS nombres, LTRIM(RTRIM(paci.APELLIDO_PERSONA)) AS apellidos, ficha.talla ,ficha.resp ,ficha.abd ,ficha.peso ,ficha.card ,ficha.cadera, ficha.imc  ,ficha.icc ,ficha.satoxi ,ficha.temp,(select isnull((select resultado from d_labo where cdg_exa=2 and  cdg_fmed=ficha.cdg_fmed),'-') ) as hemoglobina,(select (isnull((select resultado from d_labo where cdg_exa=16 and cdg_fmed=ficha.cdg_fmed),isnull((select resultado from d_labo where cdg_exa=22 and cdg_fmed=ficha.cdg_fmed),'-')))) as colesterol,(select(isnull((select resultado from d_labo where cdg_exa=17 and cdg_fmed=ficha.cdg_fmed),isnull((select resultado from d_labo where cdg_exa=111 and cdg_fmed=ficha.cdg_fmed),'-')))) as trigliceridos,(select isnull((select resultado from d_labo where cdg_exa=14 and cdg_fmed=ficha.cdg_fmed),'-')) as glucosa FROM m_fmed ficha,vclientes mc,D_TABLAS EXA,vpaciente paci  WHERE ficha.cdg_fmed='${fichaMedica}' and ficha.ruc_cli = mc.ruc_cli AND (ficha.tip_Exa = EXA.NUM_ITEM AND EXA.cdg_tab='EXA') AND (ficha.NUM_DNI = paci.NUM_DNI AND ficha.cdg_tdoc = paci.cdg_tdoc )`

      return this.database.query(query)
    } catch (error: unknown) {
      throw error
    }
  }
}

