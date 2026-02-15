import {
  DB_HOST,
  DB_INSTANCE,
  DB_NAME,
  DB_PASS,
  DB_USER,
  Database
} from '../../shared'
import { AttentionMonitoringQueryDTO } from '../dto/attention-monitoring.query.dto'
import { AttentionMonitoring } from './entity/attention-monitoring'
import { IAttentionMonitoringRepository } from './interfaces/attention-monitoring.repository.interface'

export default class AttentionMonitoringRepository implements IAttentionMonitoringRepository {
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

  async find(
    params: AttentionMonitoringQueryDTO,
    ruc: string
  ): Promise<AttentionMonitoring[]> {
    try {
      let data: AttentionMonitoring[] = []

      const query = `
      select f.fec_fmed, LTRIM(RTRIM(f.num_dni)) AS num_dni, f.cdg_fmed, RTRIM(LTRIM(P.APELLIDO_PERSONA)) +', '+ RTRIM(LTRIM(P.NOMBRE_PERSONA)) AS nombres, a.h_ing,a.h_sal, md=case when(select distinct(mp.abr_area) from M_CONTRATO ct,D_PROFOR dp, m_perfiles mp where ct.cdg_prof=dp.CDG_PROF and dp.num_item=mp.cdg_perfil and ct.cdg_cont=f.cdg_cont and mp.abr_area='medi' and f.fec_fmed between '${params.startDate}' and '${params.endDate}')is null then 'NOPASA' else  case when(select r.cdg_fmed from r_medicina r where r.cdg_fmed=f.cdg_fmed and f.fec_fmed between '${params.startDate}' and '${params.endDate}') is null then 'FALTA' else 'X' end end, oft=case when(select distinct(mp.abr_area) from M_CONTRATO ct,D_PROFOR dp, m_perfiles mp where ct.cdg_prof=dp.CDG_PROF and dp.num_item=mp.cdg_perfil and ct.cdg_cont=f.cdg_cont and mp.abr_area='ofta' and f.fec_fmed between '${params.startDate}' and '${params.endDate}') is null then 'NOPASA' else case when(select r.cdg_fmed from r_oftalmo r where r.cdg_fmed=f.cdg_fmed and f.fec_fmed between '${params.startDate}' and '${params.endDate}'  ) is null then 'FALTA' else 'X' end end, ot=case when(select distinct(mp.abr_area) from M_CONTRATO ct,D_PROFOR dp, m_perfiles mp where ct.cdg_prof=dp.CDG_PROF and dp.num_item=mp.cdg_perfil and ct.cdg_cont=f.cdg_cont and mp.abr_area='otor' and f.fec_fmed between '${params.startDate}' and '${params.endDate}'  )is null then 'NOPASA'  else case when(select r.cdg_fmed from r_otorrino r where r.cdg_fmed=f.cdg_fmed and f.fec_fmed between '${params.startDate}' and '${params.endDate}')is null then 'FALTA' else 'X' end end, rx=case when(select distinct(mp.abr_area) from M_CONTRATO ct,D_PROFOR dp, m_perfiles mp where ct.cdg_prof=dp.CDG_PROF and dp.num_item=mp.cdg_perfil and ct.cdg_cont=f.cdg_cont and mp.abr_area='radi' and f.fec_fmed between '${params.startDate}' and '${params.endDate}'  )is null then 'NOPASA'  else  case when(select r.cdg_fmed from r_rx r where r.cdg_fmed=f.cdg_fmed and f.fec_fmed between '${params.startDate}' and '${params.endDate}')is null then 'FALTA' else 'X' end end,lb=case when(select distinct(mp.abr_area) from M_CONTRATO ct,D_PROFOR dp, m_perfiles mp where ct.cdg_prof=dp.CDG_PROF and dp.num_item=mp.cdg_perfil and ct.cdg_cont=f.cdg_cont and mp.abr_area='labo' and f.fec_fmed between '${params.startDate}' and '${params.endDate}'  )is null then 'NOPASA' else case when(select r.cdg_fmed from r_labo r where r.cdg_fmed=f.cdg_fmed and f.fec_fmed between '${params.startDate}' and '${params.endDate}' )is null then 'FALTA' else 'X' end end, od=case when(select distinct(mp.abr_area) from M_CONTRATO ct,D_PROFOR dp, m_perfiles mp where ct.cdg_prof=dp.CDG_PROF and dp.num_item=mp.cdg_perfil and ct.cdg_cont=f.cdg_cont and mp.abr_area='odon' and f.fec_fmed between '${params.startDate}' and '${params.endDate}' ) is null then 'NOPASA' else  case when(select r.cdg_fmed from r_odonto r where r.cdg_fmed=f.cdg_fmed and f.fec_fmed between '${params.startDate}' and '${params.endDate}' )is null then 'FALTA' else 'X' end end, ca=case when(select distinct(mp.abr_area) from M_CONTRATO ct,D_PROFOR dp, m_perfiles mp where ct.cdg_prof=dp.CDG_PROF and dp.num_item=mp.cdg_perfil and ct.cdg_cont=f.cdg_cont and mp.abr_area='card' and f.fec_fmed between '${params.startDate}' and '${params.endDate}'  )is null then 'NOPASA' else case when(select r.cdg_fmed from r_cardio r where r.cdg_fmed=f.cdg_fmed and f.fec_fmed between '${params.startDate}' and '${params.endDate}'  )is null then 'FALTA' else 'X' end end, es=case when(select distinct(mp.abr_area) from M_CONTRATO ct,D_PROFOR dp, m_perfiles mp where ct.cdg_prof=dp.CDG_PROF and dp.num_item=mp.cdg_perfil and ct.cdg_cont=f.cdg_cont and mp.abr_area='neum' and f.fec_fmed between '${params.startDate}' and '${params.endDate}' )is null then 'NOPASA' else case when(select r.cdg_fmed from r_espiro r where r.cdg_fmed=f.cdg_fmed and f.fec_fmed between '${params.startDate}' and '${params.endDate}'  )is null then 'FALTA' else 'X' end end, ps=case when(select distinct(mp.abr_area) from M_CONTRATO ct,D_PROFOR dp, m_perfiles mp where ct.cdg_prof=dp.CDG_PROF and dp.num_item=mp.cdg_perfil and ct.cdg_cont=f.cdg_cont and mp.abr_area='psic' and f.fec_fmed between '${params.startDate}' and '${params.endDate}'  )is null then 'NOPASA' else case when(select r.cdg_fmed from r_psico r where r.cdg_fmed=f.cdg_fmed and f.fec_fmed between '${params.startDate}' and '${params.endDate}' )is null then 'FALTA' else 'X' end end, tr=case when(select distinct(mp.abr_area) from M_CONTRATO ct,D_PROFOR dp, m_perfiles mp where ct.cdg_prof=dp.CDG_PROF and dp.num_item=mp.cdg_perfil and ct.cdg_cont=f.cdg_cont and mp.abr_area='medi' and f.fec_fmed between '${params.startDate}' and '${params.endDate}'  ) is null then 'NOPASA' else case when(select r.cdg_fmed from r_triaje r where r.cdg_fmed=f.cdg_fmed and f.fec_fmed between '${params.startDate}' and '${params.endDate}' ) is null then 'FALTA' else 'X' end end ,a.obs_des,a.cdg_lug from m_fmed f,vpaciente p,m_atenreg a where f.fec_fmed between '${params.startDate}' and '${params.endDate}'  and f.num_dni=p.NUM_DNI and f.num_dni=a.dni AND F.fec_fmed=A.FECHA and f.ruc_cli='${ruc}' and f.cdg_sede='${params.headquarter}' order by 1`

      const result = await this.database.query<AttentionMonitoring>(query)

      if (!result.success) {
        return data
      }

      data = result.data

      return data
    } catch (error: unknown) {
      throw error
    }
  }
}
