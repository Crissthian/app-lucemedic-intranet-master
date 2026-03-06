import {
  DB_HOST,
  DB_INSTANCE,
  DB_NAME,
  DB_PASS,
  DB_USER,
  Database,
  QueryParams
} from '../../shared'
import { AptitudQueryDTO } from '../dto/aptitud.query.dto'
import { SabanaQueryDTO } from '../dto/sabana.query.dto'

type SabanaRow = Record<string, unknown>

export default class SabanaRepository {
  private readonly database: Database

  constructor() {
    this.database = new Database({
      server: DB_HOST,
      user: DB_USER,
      password: DB_PASS,
      database: DB_NAME,
      requestTimeout: 600000, // 10 minutes
      options: {
        encrypt: false,
        trustServerCertificate: true,
        instanceName: DB_INSTANCE
      }
    })
  }

  async find(params: SabanaQueryDTO, ruc: string): Promise<SabanaRow[]> {
    try {
      let data: SabanaRow[] = []
      const queryParams: QueryParams = { ruc }

      let query = `
      SELECT m.cdg_fmed,c.DES_CLI as empresa, RTRIM(LTRIM(P.APELLIDO_PERSONA)) +' , '+ RTRIM(LTRIM(P.NOMBRE_PERSONA)) AS nombres,

      LTRIM(RTRIM(F.num_dni)) AS dni,CONVERT(varchar,P.FECHA_NAC,103) AS [fecha_nacimiento],P.edad AS edad,P.sexo AS sexo,

      RTRIM(LTRIM(F.puestopostula)) AS puesto_postula, RTRIM(LTRIM(F.pue_trb)) AS puesto, RTRIM(LTRIM(exa.DES_ITEM)) AS tipo_examen,RTRIM(LTRIM(co.des_cont)) as protocolo, f.unidad AS [UNIDAD],CONVERT(varchar,F.fec_fmed,103) AS [fecha_examen],

      CASE APTITUD

      WHEN 1 THEN 'APTO'

      WHEN 2 THEN 'APTO CON RESTRICCIONES'

      WHEN 3 THEN 'NO APTO'

      WHEN 4 THEN 'OBSERVADO'

      ELSE ' ' END as aptitud,

      inf.RESTRICCIONES,

      inf.RECOMENDACONES,

            M.PA_SIS

            ,M.PA_DIA

            ,M.FC_SAB AS [FRECUENCIA CARDIACA]

            ,M.FR_SAB AS [FRECUENCIA RESPIRATORIA]

            ,M.T_SAB AS TEMPERATURA

            ,M.SO2_SAB AS [SATURACION DE OXIGENO]

            ,M.TAL_SAB AS TALLA

            ,M.PES_SAB AS PESO

            ,M.IMC_SAB AS IMC

            ,M.CIRA_SAB AS [CIRCUNFERENCIA ABDOMINAL]

            ,M.CIRC_SAB AS [CIRCUNFERENCIA CADERA]

            ,M.IND_SAB AS ICC

            ,M.FVC_SAB AS FVC

            ,M.FEV_SAB AS FEV1

            ,M.FFV_SAB AS [FEV1/FVC]

            ,M.FEV25_SAB AS [FEV 25-75%]

            ,M.ESD_1 AS [DX1. ESPIRO]

            ,M.ESD_2 AS [DX2. ESPIRO]

            ,M.ESD_3 AS [DX3. ESPIRO]

            ,M.ESD_4 AS [DX4. ESPIRO]

            ,M.ESD_5 AS [DX5. ESPIRO]

            ,M.OD1_SAB AS [OTOSC. OD]

            ,M.OI1_SAB AS [OTOSC. OI]

            ,M.N1251_SAB AS [AER. OD 125]

            ,M.N2501_SAB AS [AER. OD 250]

            ,M.N5001_SAB AS [AER. OD 500]

            ,M.N10001_SAB AS [AER. OD 1000]

            ,M.N20001_SAB AS [AER. OD 2000]

            ,M.N30001_SAB AS [AER. OD 3000]

            ,M.N40001_SAB AS [AER. OD 4000]

            ,M.N60001_SAB AS [AER. OD 6000]

            ,M.N80001_SAB AS [AER. OD 8000]

            ,[N1252_SAB] AS [AER. OI 125]

            ,[N2502_SAB] AS [AER. OI 250]

            ,[N5002_SAB] AS [AER. OI 500]

            ,[N10002_SAB] AS [AER. OI 1000]

            ,[N20002_SAB] AS [AER. OI 2000]

            ,[N30002_SAB] AS [AER. OI 3000]

            ,[N40002_SAB] AS [AER. OI 4000]

            ,[N60002_SAB] AS [AER. OI 6000]

            ,[N80002_SAB] AS [AER. OI 8000]

            ,[N2503_SAB] AS [OSEO OD 250]

            ,[N5003_SAB] AS [OSEO OD 500]

            ,[N10003_SAB] AS [OSEO OD 1000]

            ,[N20003_SAB] AS [OSEO OD 2000]

            ,[N30003_SAB] AS [OSEO OD 3000]

            ,[N40003_SAB] AS [OSEO OD 4000]

            ,[N60003_SAB] AS [OSEO OD 6000]

            ,[N80003_SAB] AS [OSEO OD 8000]

            ,[N2504_SAB] AS [OSEO OI 250]

            ,[N5004_SAB] AS [OSEO OI 500]

            ,[N10004_SAB] AS [OSEO OI 1000]

            ,[N20004_SAB] AS [OSEO OI 2000]

            ,[N30004_SAB] AS [OSEO OI 3000]

            ,[N40004_SAB] AS [OSEO OI 4000]

            ,[N60004_SAB] AS [OSEO OI 6000]

            ,[N80004_SAB] AS [OSEO OI 8000]

            ,[OTK_1]

            ,[OTK_2]

            ,[OTK_3]

            ,[OTK_4]

            ,[OTK_5]

            ,[OTD_1] AS [DX1. AUDIOMETRIA]

            ,[OTD_2] AS [DX2. AUDIOMETRIA]

            ,[OTD_3] AS [DX3. AUDIOMETRIA]

            ,[OTD_4] AS [DX4. AUDIOMETRIA]

            ,[OTD_5] AS [DX5. AUDIOMETRIA]

            ,[SC1_SAB] as [CERCA OD SC]

            ,[CC1_SAB] as [CERCA OD CC]

            ,[SC2_SAB] as [CERCA OI SC]

            ,[CC2_SAB] as [CERCA OI CC]

            ,[SC3_SAB] as [LEJOS OD SC]

            ,[CC3_SAB] as [LEJOS OD CC]

            ,[CC4_SAB] as [LEJOS OI SC]

            ,[SC4_SAB] as [LEJOS OI CC]

            ,[TONOD1_SAB] AS [TONOMETRIA OD]

            ,[TONOI1_SAB] AS [TONOMETRIA OD]

            ,

              CASE [VISIS_SAB]

      WHEN '1' THEN 'NORMAL'

      WHEN '2' THEN 'ANORMAL'

      ELSE ' ' END as ISHIHARA

              ,[ESTES_SAB] AS ESTEREOPSIS

            ,[OFD_1] as [DX1. OFTALMOLOGIA]

            ,[OFD_2] as [DX2. OFTALMOLOGIA]

            ,[OFD_3] as [DX3. OFTALMOLOGIA]

            ,[OFD_4] as [DX4. OFTALMOLOGIA]

            ,[OFD_5] as [DX5. OFTALMOLOGIA]

            ,[ODOD_1] AS [DX1. ODONTOLOGIA]

            ,[ODOD_2] AS [DX2. ODONTOLOGIA]

            ,[ODOD_3] AS [DX3. ODONTOLOGIA]

            ,[ODOD_4] AS [DX4. ODONTOLOGIA]

            ,[ODOD_5] AS [DX5. ODONTOLOGIA]

            ,[GRUP_SAB] AS GRUPO

            ,[FACT_SAB] AS FACTOR

            ,[HB1_SAB] AS HEMOGLOBINA

            ,[HCT1_SAB] AS HEMATOCRITO

            ,[RCTO_SAB] AS [RCTO. HEMATIES]

            ,[VCM_SAB] AS VCM

            ,[HCM_SAB] AS HCM

            ,[CCMH_SAB] AS CCMH

            ,[CRCTO_SAB] AS LEUCOCITOS

            ,[ABS_SAB] AS ABASTONADOS

            ,[SEGM_SAB] AS SEGMENTADOS

            ,[EOSIN_SAB] AS EOSINOFILOS

            ,[BASO_SAB] AS BASOFILOS

            ,[MONOC_SAB] AS MONOCITOS

            ,[LINF_SAB] AS LINFOCITOS

            ,[RECPLA_SAB] AS [RECUENTO PLAQUETAS]

            ,[GLUCO_SAB] AS GLUCOSA

            ,[COLEST_SAB] AS COLESTEROL

            ,[LDL_SAB] AS LDL

            ,[HDL_SAB] AS HDL

            ,[VLDL_SAB] AS VLDL

            ,[RIESG_SAB] AS [RIESGO CORONARIO]

            ,[TRIGLI1_SAB] AS TRIGLICERIDOS

            ,[TGP_SAB] AS TGP

            ,[TGO_SAB] AS TGO

            ,[GGTP_SAB] AS GGTP

            ,[FOSFATA_SAB] AS [FOSFATASA ALCALINA]

            ,[BILIRT_SAB] AS [BILIRRUBINA TOTAL]

            ,[BILIRD_SAB] AS [BILIRRUBINA DIRECTA]

            ,[BILIRI_SAB] AS [BILIRRUBINA INDIRECTA]

            ,[UREA_SAB] AS UREA

            ,[CREAT_SAB] AS CREATININA

            ,[ACIDO_SAB] AS [ACIDO URICO]

            ,[PCR_SAB] AS PCR

            ,[VSG_SAB] AS VSG

            ,[BHCG_SAB] AS BHCG

            ,[VDRL_SAB] AS VDRL

            ,[RPR_SAB] AS RPR

            ,[VIH_SAB] AS VIH

            ,[PLOMO_SAB] AS PLOMO

            ,[CROMO_SAB] AS CROMO

            ,[ARS_SAB] AS ARSENICO

            ,[COBRE_SAB] AS COBRE

            ,[CAD_SAB] AS CADMIO

            ,[COCAI_SAB] AS COCAINA

            ,[MARIH_SAB] AS MARIHUANA

              ,[ANFE_SAB] AS ANFETAMINAS

            ,[COLOR_SAB] AS [ORINA COLOR]

            ,[ASPECT_SAB]AS [ORINA ASPECTO]

            ,[PH_SAB] AS [ORINA PH]

            ,[DENSID_SAB] AS [ORINA DENSIDAD]

            ,[PROTE_SAB] AS [ORINA PTOTEINAS]

            ,[CGLUCO_SAB]AS [ORINA GLUCOSA]

            ,[CUGET_SAB] AS [CUERPOS CETONICOS]

            ,[BILIRR_SAB] AS [ORINA BILIRRUBINA]

            ,[CELUEPI_SAB] AS [ORINA CELULAS EPITELIALES]

            ,[GERM_SAB] AS [ORINA GERMENES]

            ,[LEUCOT_SAB] AS [ORINA LEUCOCITOS]

            ,[CILINS_SAB] AS [ORINA CILINDROS]

            ,[CRISTS_SAB] AS [ORINA CRISTALES]

            ,[LAD_1] AS [DX1. LABORATORIO]

            ,[LAD_2]AS [DX2. LABORATORIO]

            ,[LAD_3]AS [DX3. LABORATORIO]

            ,[LAD_4]AS [DX4. LABORATORIO]

            ,[LAD_5]AS [DX5. LABORATORIO]

            ,[MED_1] AS [DX1. MEDICINA]

            ,[MED_2]AS [DX2. MEDICINA]

            ,[MED_3]AS [DX3. MEDICINA]

            ,[MED_4]AS [DX4. MEDICINA]

            ,[MED_5]AS [DX5. MEDICINA]

            ,[RXD_1] AS [DX1. RADIOLOGIA]

            ,[RXD_2] AS [DX2. RADIOLOGIA]

            ,[RXD_3] AS [DX3. RADIOLOGIA]

            ,[RXD_4] AS [DX4. RADIOLOGIA]

            ,[RXD_5] AS [DX5. RADIOLOGIA]

            ,[EKGD_1] AS [DX1.CARDIOLOGIA]

            ,[EKGD_2] AS [DX2.CARDIOLOGIA]

            ,[EKGD_3]AS [DX3CARDIOLOGIA]

            ,[EKGD_4]AS [DX4.CARDIOLOGIA]

            ,[EKGD_5]AS [DX5.CARDIOLOGIA]

            ,[PSD_1] AS [DX1.PSICOLOGIA]

            ,[PSD_2] AS [DX2.PSICOLOGIA]

            ,[PSD_3] AS [DX3.PSICOLOGIA]

            ,[PSD_4] AS [DX4.PSICOLOGIA]

            ,[PSD_5] AS [DX5.PSICOLOGIA]

            ,

              a7.anexo16a,f.opcaptitu AS ALTURA

        FROM [dbo].[M_MSABANA] m
      INNER JOIN m_fmed f ON m.cdg_fmed = f.cdg_fmed
      INNER JOIN vclientes c ON m.ruc_SAB = c.RUC_CLI
      INNER JOIN vpaciente p ON f.num_dni = p.NUM_DNI
      INNER JOIN D_TABLAS exa ON f.tip_exa = exa.NUM_ITEM AND exa.CDG_TAB = 'EXA'
      INNER JOIN M_CONTRATO co ON f.cdg_cont = co.cdg_cont
      OUTER APPLY (
        SELECT
          LTRIM(RTRIM(STUFF((SELECT '/' + i.des_obs FROM d_informes i WHERE i.cdg_fmed = f.cdg_fmed FOR XML PATH('')), 1, 1, ''))) AS RESTRICCIONES,
          LTRIM(RTRIM(STUFF((SELECT '/' + i.des_recomen FROM d_informes i WHERE i.cdg_fmed = f.cdg_fmed FOR XML PATH('')), 1, 1, ''))) AS RECOMENDACONES
      ) inf
      OUTER APPLY (
        SELECT TOP 1 a.APTITUD AS anexo16a FROM m_7D a WHERE a.cdg_fmed = f.cdg_fmed
      ) a7

      WHERE m.ruc_SAB = @ruc`

      if (params.startDate && params.endDate) {
        query += ' AND f.fec_fmed between @startDate AND @endDate'
        queryParams.startDate = params.startDate
        queryParams.endDate = params.endDate
      }

      if (params.examType) {
        query += ' AND f.tip_exa=@examType'
        queryParams.examType = params.examType
      }

      if (params.sede) {
        query += ' AND f.cdg_sede=@sede'
        queryParams.sede = params.sede
      }

      if (params.lastName) {
        query += ' AND p.APELLIDO_PERSONA LIKE @lastName'
        queryParams.lastName = `%${params.lastName}%`
      }

      const result = await this.database.queryWithParams<SabanaRow>(
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

  async findAptitud(
    params: AptitudQueryDTO,
    ruc: string
  ): Promise<SabanaRow[]> {
    try {
      let data: SabanaRow[] = []
      const queryParams: QueryParams = { ruc }

      // const query = `
      // Select ficha.cdg_fmed,Convert(varchar(10),CONVERT(date,ficha.fec_fmed,106),103) as fec_fmed, ficha.tip_exa AS cdg_t_examen, LTRIM(RTRIM(EXA.DES_ITEM)) AS t_examen, LTRIM(RTRIM(ficha.num_dni)) AS num_dni, LTRIM(RTRIM(paci.NOMBRE_PERSONA)) AS nombres, LTRIM(RTRIM(paci.APELLIDO_PERSONA)) AS apellidos , CASE FICHA.APTITUD WHEN 1 THEN 'APTO' WHEN 2 THEN 'APTO CON RESTRICCIONES' WHEN 3 THEN 'NO APTO' WHEN 4 THEN 'OBSERVADO' ELSE ' ' END as aptitud From m_fmed ficha,vclientes mc,D_TABLAS EXA,vpaciente paci  Where FICHA.cdg_sede='001' AND FICHA.fec_fmed BETWEEN '${startDate}' AND '${endDate}' AND FICHA.tip_exa='001'  and ficha.ruc_cli = mc.ruc_cli AND ficha.ruc_cli='${ruc}' AND FICHA.EWEB=1 and ficha.tip_exa <>'004' AND (ficha.tip_Exa = EXA.NUM_ITEM AND EXA.cdg_tab='EXA') AND (ficha.NUM_DNI = paci.NUM_DNI AND ficha.cdg_tdoc = paci.cdg_tdoc )`;

      let query = `
      Select ficha.cdg_fmed,Convert(varchar(10),CONVERT(date,ficha.fec_fmed,106),103) as fec_fmed,
      
      LTRIM(RTRIM(ficha.tip_exa)) AS cdg_t_examen, LTRIM(RTRIM(EXA.DES_ITEM)) AS t_examen, LTRIM(RTRIM(ficha.num_dni)) AS num_dni, LTRIM(RTRIM(paci.NOMBRE_PERSONA)) AS nombres,

LTRIM(RTRIM(paci.APELLIDO_PERSONA)) AS apellidos , CASE FICHA.APTITUD

WHEN 1 THEN 'APTO'

WHEN 2 THEN 'APTO CON RESTRICCIONES'

WHEN 3 THEN 'NO APTO'

WHEN 4 THEN 'OBSERVADO'

ELSE ' ' END as aptitud

From m_fmed ficha,vclientes mc,D_TABLAS EXA,vpaciente paci  Where ficha.ruc_cli=@ruc AND ficha.ruc_cli = mc.ruc_cli

AND ficha.tip_exa <>'004'

AND (ficha.tip_Exa = EXA.NUM_ITEM AND EXA.cdg_tab='EXA') AND (ficha.NUM_DNI = paci.NUM_DNI AND ficha.cdg_tdoc = paci.cdg_tdoc )`

      if (params.lastName) {
        query += ' AND PACI.APELLIDO_PERSONA LIKE @lastName'
        queryParams.lastName = `%${params.lastName}%`
      }

      if (params.dni) {
        query += ' AND ficha.num_dni=@dni'
        queryParams.dni = params.dni
      }

      if (params.sede) {
        query += ' AND FICHA.cdg_sede=@sede'
        queryParams.sede = params.sede
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

      const result = await this.database.queryWithParams<SabanaRow>(
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

  async findInterconsultations(
    params: SabanaQueryDTO,
    ruc: string
  ): Promise<SabanaRow[]> {
    try {
      let data: SabanaRow[] = []
      const queryParams: QueryParams = { ruc }

      let query = `
      select i.cdg_reg AS CODIGO ,Convert(varchar(10),CONVERT(date,i.fec_reg,106),103) as FECHA,LTRIM(RTRIM(p.NUM_DNI)) AS DNI, ltrim(rtrim(p.APELLIDO_PERSONA)) as APELLIDOS ,ltrim(rtrim(p.NOMBRE_PERSONA)) AS NOMBRES,i.cdg_fmed AS FICHA,LTRIM(RTRIM(i.especialidad)) AS ESPECIALIDAD, case f.tip_exa when '001' then 'EXAMEN PRE OCUPACIONAL' WHEN '002' THEN 'EXAMEN ANUAL'WHEN '003' THEN 'EXAMEN DE RETIRO'ELSE 'OTROS' END AS [TIPO EXAMEN], CASE i.estado  WHEN 1 THEN 'PENDIENTE'  ELSE 'CERRADO'  END as ESTADO,CASE i.TIPO WHEN 1 THEN 'ESPECIALIDAD' WHEN 2 THEN 'VIGILANCIA MEDICA' ELSE '' END AS TIPO, CASE  WHEN i.estado = 2 THEN 'Cerrado'  ELSE  CASE  WHEN f.ruc_cli = @ruc AND DATEDIFF(day, i.fec_reg, GETDATE()) > 30 THEN 'VENCIDO' WHEN f.ruc_cli <> @ruc AND DATEDIFF(day, i.fec_reg, GETDATE()) > 15 THEN 'VENCIDO' ELSE 'EN FECHA'END  END AS CONDICION from m_interconsulta i,vpaciente p,m_fmed f,vclientes vc where i.cdg_fmed=f.cdg_fmed and f.num_dni=p.NUM_DNI and  f.ruc_cli=vc.RUC_CLI   AND vc.RUC_CLI = @ruc`

      if (params.startDate && params.endDate) {
        query += ' and (i.fec_reg >= @startDate AND i.fec_reg <= @endDate)'
        queryParams.startDate = params.startDate
        queryParams.endDate = params.endDate
      }

      query += ' order by 1 desc'

      const result = await this.database.queryWithParams<SabanaRow>(
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
}
