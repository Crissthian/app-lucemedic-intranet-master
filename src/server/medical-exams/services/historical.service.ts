import { FTPClient, FTP_AUDIOMETRY_HOST, SMBClient, logger } from '../../shared'
import {
  CardiologyReport,
  IMCReport,
  LaboratoryExamsReport
} from '../repository/entity'
import HistoricalRepository from '../repository/historical.repository'
import { IHistoricalRepository } from '../repository/interfaces/historical.repository.interface'

type RadiologyImagesResult = {
  radiologies: { cdg_fmed: string }[]
  localFiles: Buffer[]
}

type AudiometryImagesResult = {
  audiometries: { cdg_reg: string; year: string; month: string }[]
  localFiles: Buffer[]
}

export default class HistoricalService {
  private readonly ftpClient: FTPClient
  private readonly sambaClient: SMBClient
  private readonly repository: IHistoricalRepository

  constructor() {
    this.ftpClient = new FTPClient()
    this.sambaClient = new SMBClient()
    this.repository = new HistoricalRepository()
  }

  async downloadRadiologyImages(dni: string): Promise<RadiologyImagesResult> {
    try {
      const localFiles: Buffer[] = []
      const paths: string[] = []

      const radiologies = await this.repository.findRadiology(dni)
      logger.info(`Radiologies found: ${radiologies.length}`)

      for (const radiology of radiologies) {
        const path = `/rx/${radiology.cdg_fmed}.jpg`
        paths.push(path)
      }

      logger.info(`Downloading radiology files: ${paths.length}`)

      for (const path of paths) {
        const file = await this.ftpClient.downloadFile(
          path,
          undefined,
          'empresas',
          'jpg'
        )
        localFiles.push(file)
      }

      return {
        radiologies,
        localFiles
      }
    } catch (error: unknown) {
      logger.error((error as Error).message)

      throw new Error('Error while trying to download radiology images')
    }
  }

  async downloadAudiometryImages(dni: string): Promise<AudiometryImagesResult> {
    try {
      const localFiles: Buffer[] = []
      const paths: string[] = []

      const audiometries = await this.repository.findAudiometry(dni)

      logger.info(`Audiometries found: ${audiometries.length}`)
      logger.info(`Audiometries raw data: ${JSON.stringify(audiometries)}`)

      for (const audiometry of audiometries) {
        const translatedMonth = this.getMonth(audiometry.month)
        const path = `/${audiometry.year}/${translatedMonth}/${audiometry.cdg_reg}.png`
        logger.info(`Audiometry path constructed: ${path} (raw month: "${audiometry.month}", translated: "${translatedMonth}")`)
        paths.push(path)
      }

      logger.info(`Downloading audiometry files: ${paths.length}`)

      for (const path of paths) {
        logger.info(`Attempting FTP download from ${FTP_AUDIOMETRY_HOST}, path: ${path}`)
        const file = await this.sambaClient.downloadFile(
          path,
          undefined,
          'graficosotorrino'
        )
        localFiles.push(file)
      }

      return {
        audiometries,
        localFiles
      }
    } catch (error: unknown) {
      logger.error(`downloadAudiometryImages error for dni ${dni}: ${(error as Error).message}`)
      logger.error(`Stack: ${(error as Error).stack}`)

      throw new Error('Error while trying to download audiometry images')
    }
  }

  async getCardiologyReport(dni: string): Promise<CardiologyReport[]> {
    try {
      return this.repository.findCardiology(dni)
    } catch (error: unknown) {
      logger.error((error as Error).message)

      throw new Error('Error while trying to get cardiology report')
    }
  }

  async getIMCReport(dni: string): Promise<IMCReport[]> {
    try {
      return this.repository.findIMC(dni)
    } catch (error: unknown) {
      logger.error((error as Error).message)

      throw new Error('Error while trying to get cardiology report')
    }
  }

  async getLaboratyExamsReport(dni: string): Promise<LaboratoryExamsReport[]> {
    try {
      return this.repository.findLaboratoryExams(dni)
    } catch (error: unknown) {
      logger.error((error as Error).message)

      throw new Error('Error while trying to get cardiology report')
    }
  }

  private getMonth(month: string): string {
    if (month === 'September') {
      return 'SETIEMBRE'
    }

    if (month === 'November') {
      return 'NOVIEMBRE'
    }

    if (month === 'August') {
      return 'AGOSTO'
    }

    if (month === 'July') {
      return 'JULIO'
    }

    if (month == 'June') {
      return 'JUNIO'
    }

    if (month === 'May') {
      return 'MAYO'
    }

    if (month === 'March') {
      return 'MARZO'
    }

    if (month === 'April') {
      return 'ABRIL'
    }

    if (month === 'February') {
      return 'FEBRERO'
    }

    if (month === 'December') {
      return 'DICIEMBRE'
    }

    if (month === 'October') {
      return 'OCTUBRE'
    }

    if (month === 'January') {
      return 'ENERO'
    }

    return month.toUpperCase()
  }
}
