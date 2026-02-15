import { FTPClient, logger } from '../../shared'
import {
  CardiologyReport,
  IMCReport,
  LaboratoryExamsReport,
} from '../repository/entity'
import HistoricalRepository from '../repository/historical.repository'
import { IHistoricalRepository } from '../repository/interfaces/historical.repository.interface'

type RadiologyImagesResult = {
  radiologies: { cdg_fmed: string }[];
  localFiles: string[];
};

type AudiometryImagesResult = {
  audiometries: { cdg_reg: string; year: string; month: string }[];
  localFiles: string[];
};

export default class HistoricalService {
  private readonly sambaClient: FTPClient
  private readonly repository: IHistoricalRepository

  constructor() {
    this.sambaClient = new FTPClient()
    this.repository = new HistoricalRepository()
  }

  async downloadRadiologyImages(dni: string): Promise<RadiologyImagesResult> {
    try {
      const localFiles: string[] = []
      const paths: string[] = []

      const radiologies = await this.repository.findRadiology(dni)
      logger.info(`Radiologies found: ${JSON.stringify(radiologies)}`)

      for (const radiology of radiologies) {
        const path = `/rx/${radiology.cdg_fmed}.jpg`
        paths.push(path)
      }

      logger.info(`Downloading files from: ${paths}`)

      for (const path of paths) {
        const file = await this.sambaClient.downloadFile(
          path,
          undefined,
          'empresas',
          'jpg',
        )
        localFiles.push(file)
      }

      return {
        radiologies,
        localFiles,
      }
    } catch (error: unknown) {
      logger.error((error as Error).message)

      throw new Error('Error while trying to download radiology images')
    }
  }

  async downloadAudiometryImages(dni: string): Promise<AudiometryImagesResult> {
    try {
      const localFiles: string[] = []
      const paths: string[] = []

      const audiometries = await this.repository.findAudiometry(dni)

      logger.info(`Audiometries found: ${JSON.stringify(audiometries)}`)

      for (const audiometry of audiometries) {
        const path = `/${audiometry.year}/${this.getMonth(audiometry.month)}/${audiometry.cdg_reg}.png`
        paths.push(path)
      }

      logger.info(`Downloading files from: ${paths}`)

      for (const path of paths) {
        const file = await this.sambaClient.downloadFile(
          path,
          '192.168.1.34',
          'graficosotorrino',
          'png',
        )
        localFiles.push(file)
      }

      return {
        audiometries,
        localFiles,
      }
    } catch (error: unknown) {
      logger.error((error as Error).message)

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
      return 'Setiembre'
    }

    if (month === 'November') {
      return 'Noviembre'
    }

    if (month === 'August') {
      return 'Agosto'
    }

    if (month === 'July') {
      return 'Julio'
    }

    if (month == 'June') {
      return 'Junio'
    }

    if (month === 'May') {
      return 'Mayo'
    }

    if (month === 'March') {
      return 'Marzo'
    }

    if (month === 'April') {
      return 'Abril'
    }

    if (month === 'February') {
      return 'Febrero'
    }

    if (month === 'December') {
      return 'Diciembre'
    }

    if (month === 'October') {
      return 'Octubre'
    }

    if (month === 'January') {
      return 'Enero'
    }

    return month
  }
}

