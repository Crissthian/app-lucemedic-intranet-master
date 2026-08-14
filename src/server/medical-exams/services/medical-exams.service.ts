import { FTPClient, logger } from '../../shared'
import { MedicalExamsQueryDTO } from '../dto/medical-exams-query.dto'
import { UserToken } from '../dto/user-token.dto'
import DiagnosisRepository from '../repository/diagnosis.repository'
import { Consultations, Recommendations } from '../repository/entity'
import { MedicalExams } from '../repository/entity/medical-exams'
import { MedicalRecord } from '../repository/entity/medical-record'
import { IDiagnosisRepository } from '../repository/interfaces/diagnosis.repository.interface'
import { IMedicalExamsRepository } from '../repository/interfaces/medical-exams.repository.interface'
import MedicalExamsRepository from '../repository/medical-exams.repository'

type DiagnosisItem = {
  type: string
  data: string
}

export default class MedicalExamsService {
  private readonly repository: IMedicalExamsRepository
  private readonly diagnosisRepository: IDiagnosisRepository
  private readonly sambaClient: FTPClient

  constructor() {
    this.repository = new MedicalExamsRepository()
    this.diagnosisRepository = new DiagnosisRepository()
    this.sambaClient = new FTPClient()
  }

  async find(
    query: MedicalExamsQueryDTO,
    user: UserToken
  ): Promise<MedicalExams[]> {
    let data: MedicalExams[] = []

    data = await this.repository.findAll(query, user.ruc)

    // if (query.dni || query.startDate && query.endDate) {
    //   data = await this.repository.findByDNIAndDates(query.dni);
    // }

    // if (query.sede) {
    //   data = await this.repository.findBySede(query.sede, user.ruc);
    // }

    // if (query.examType) {
    //   data = await this.repository.findByExamType(query.examType, user.ruc);
    // }

    // if (query.startDate && query.endDate) {
    //   data = await this.repository.findByDates(query.startDate, query.endDate, user.ruc);
    // }

    // if (query.lastName) {
    //   data = await this.repository.findByLastName(query.lastName, user.ruc);
    // }

    return data
  }

  async findOne(uid: string): Promise<MedicalRecord | null> {
    const result = await this.repository.findByFichaMedica(uid)

    return result[0] ?? null
  }

  async downloadEMO(user: UserToken, uid: string): Promise<Buffer> {
    try {
      void user

      const path = `/EMO/${uid}.pdf`

      logger.info('Downloading EMO file')

      return this.sambaClient.downloadFile(path)
    } catch (error: unknown) {
      logger.error((error as Error).message)

      throw new Error('Error while trying to download EMO')
    }
  }

  async downloadCertificado(user: UserToken, uid: string): Promise<Buffer> {
    try {
      void user

      const path = `/CERTIFICADO/${uid}.pdf`

      logger.info('Downloading certificado file')

      return this.sambaClient.downloadFile(path)
    } catch (error: unknown) {
      logger.error((error as Error).message)

      throw new Error('Error while trying to download Certificado')
    }
  }

  async downloadCertificadoEtas(user: UserToken, uid: string): Promise<Buffer> {
    try {
      void user

      const path = `/empresas/CETAS/${uid}.pdf`

      logger.info(`Downloading certificado ETAS file: ${path}`)

      try {
        return await this.sambaClient.downloadFile(path)
      } catch {
        logger.warn(`Failed with ${path}, trying /EMPRESAS/CETAS/${uid}.pdf`)
        try {
          return await this.sambaClient.downloadFile(`/EMPRESAS/CETAS/${uid}.pdf`)
        } catch {
          logger.warn(`Failed with /EMPRESAS/CETAS/${uid}.pdf, trying /CETAS/${uid}.pdf`)
          return await this.sambaClient.downloadFile(`/CETAS/${uid}.pdf`)
        }
      }
    } catch (error: unknown) {
      logger.error((error as Error).message)

      throw new Error('Error while trying to download Certificado ETAS')
    }
  }

  async downloadDiagnosis(uid: string, diagnosisType: number): Promise<Buffer> {
    try {
      let path = ''

      logger.info('Preparing diagnosis download')

      switch (diagnosisType) {
        case 1:
          path = `/MEDICINA/${uid}.pdf`
          break
        case 2:
          path = `/OFTALMOLOGIA/${uid}.pdf`
          break
        case 3:
          path = `/OTORRINO/${uid}.pdf`
          break
        case 4:
          path = `/RADIOLOGIA/${uid}.pdf`
          break
        case 5:
          path = `/LABORATORIO/${uid}.pdf`
          break
        case 6:
          path = `/ODONTOLOGIA/${uid}.pdf`
          break
        case 7:
          path = `/CARDIOLOGIA/${uid}.pdf`
          break
        case 8:
          path = `/ESPIROMETRIA/${uid}.pdf`
          break
        case 9:
          path = `/PSICOLOGIA/${uid}.pdf`
          break
        case 10:
          path = `/HISTORIAOCUPACIONAL/${uid}.pdf`
          break
        case 11:
          path = `/MUSCULOESQUELETICA/${uid}.pdf`
          break
        case 12:
          path = `/FICHA312/${uid}.pdf`
          break
        case 13:
          path = `/ANEXO16/${uid}.pdf`
          break
        case 14:
          path = `/ARIESGO/${uid}.pdf`
          break
        case 15:
          path = `/ANEXO16A/${uid}.pdf`
          break
        case 16:
          path = `/PSICOSENSOMETRICA/${uid}.pdf`
          break
        default:
          break
      }

      return this.sambaClient.downloadFile(path)
    } catch (error: unknown) {
      logger.error((error as Error).message)

      throw new Error('Error while trying to download Diagnosis')
    }
  }

  async downloadDiagnosisXray(uid: string): Promise<Buffer> {
    try {
      const path = `/rx/${uid}.jpg`

      logger.info('Downloading diagnosis xray file')

      return this.sambaClient.downloadFile(path, undefined, 'rx', 'jpg')
    } catch (error: unknown) {
      logger.error((error as Error).message)

      throw new Error('Error while trying to download Diagnosis')
    }
  }

  async findDiagnosis(uid: string): Promise<DiagnosisItem[]> {
    try {
      const diagnosis: DiagnosisItem[] = []

      const medicinaDiagnosis = await this.diagnosisRepository.findMedicina(uid)
      if (medicinaDiagnosis.length > 0) {
        diagnosis.push({
          type: 'Medicina',
          data: medicinaDiagnosis[0].diagnostico || '-'
        })
      }

      const oftalmologiaDiagnosis =
        await this.diagnosisRepository.findOftalmologia(uid)
      if (oftalmologiaDiagnosis.length > 0) {
        diagnosis.push({
          type: 'Oftalmología',
          data: oftalmologiaDiagnosis[0].diagnostico || '-'
        })
      }

      const otorrinoDiagnosis = await this.diagnosisRepository.findOtorrino(uid)
      if (otorrinoDiagnosis.length > 0) {
        diagnosis.push({
          type: 'Otorrino',
          data: otorrinoDiagnosis[0].diagnostico || '-'
        })
      }

      const radiologiaDiagnosis =
        await this.diagnosisRepository.findRadiologia(uid)
      if (radiologiaDiagnosis.length > 0) {
        diagnosis.push({
          type: 'Radiología',
          data: radiologiaDiagnosis[0].diagnostico || '-'
        })
      }

      const laboratorioDiagnosis =
        await this.diagnosisRepository.findLaboratorio(uid)
      if (laboratorioDiagnosis.length > 0) {
        diagnosis.push({
          type: 'Laboratorio',
          data: laboratorioDiagnosis[0].diagnostico || '-'
        })
      }

      const odontologiaDiagnosis =
        await this.diagnosisRepository.findOdontologia(uid)
      if (odontologiaDiagnosis.length > 0) {
        diagnosis.push({
          type: 'Odontología',
          data: odontologiaDiagnosis[0].diagnostico || '-'
        })
      }

      const cardiologiaDiagnosis =
        await this.diagnosisRepository.findCardiologia(uid)
      if (cardiologiaDiagnosis.length > 0) {
        diagnosis.push({
          type: 'Cardiología',
          data: cardiologiaDiagnosis[0].diagnostico || '-'
        })
      }

      const espirometriaDiagnosis =
        await this.diagnosisRepository.findEspirometria(uid)
      if (espirometriaDiagnosis.length > 0) {
        diagnosis.push({
          type: 'Espirometría',
          data: espirometriaDiagnosis[0].diagnostico || '-'
        })
      }

      const psicologiaDiagnosis =
        await this.diagnosisRepository.findPsicologia(uid)
      if (psicologiaDiagnosis.length > 0) {
        diagnosis.push({
          type: 'Psicología',
          data: psicologiaDiagnosis[0].diagnostico || '-'
        })
      }

      diagnosis.push(
        {
          type: 'Historia Ocupacional',
          data: '_'
        },
        {
          type: 'Musculo Esquelética',
          data: '_'
        },
        {
          type: 'Ficha 312',
          data: '_'
        },
        {
          type: 'Anexo 16',
          data: '_'
        },
        {
          type: 'Altura',
          data: '_'
        },
        {
          type: 'Anexo 16A',
          data: '_'
        },
        {
          type: 'Psicosensométrica',
          data: '_'
        }
      )

      return diagnosis
    } catch (error: unknown) {
      throw error
    }
  }

  async findConsultations(uid: string): Promise<Consultations[]> {
    try {
      return this.repository.findConsultations(uid)
    } catch (error: unknown) {
      throw error
    }
  }

  async downloadConsultation(uid: string): Promise<Buffer> {
    try {
      const path = `INTERCONSULTA/${uid}.pdf`

      logger.info('Downloading consultation file')

      return this.sambaClient.downloadFile(path, undefined, 'INTERCONSULTA')
    } catch (error: unknown) {
      logger.error((error as Error).message)

      throw new Error('Error while trying to download Consultation')
    }
  }

  async findRecommendations(uid: string): Promise<Recommendations[]> {
    try {
      return this.repository.findRecommendations(uid)
    } catch (error: unknown) {
      throw error
    }
  }

  async downloadRecommendation(uid: string): Promise<Buffer> {
    try {
      const path = `RECOMENDACIONES/${uid}.pdf`

      logger.info('Downloading recommendation file')

      return this.sambaClient.downloadFile(path, undefined, 'RECOMENDACIONES')
    } catch (error: unknown) {
      logger.error((error as Error).message)

      throw new Error('Error while trying to download Consultation')
    }
  }
}
