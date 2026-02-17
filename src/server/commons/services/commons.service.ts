import { EpidemiologicalReport } from '../../medical-exams/repository/entity'
import { FTPClient, logger } from '../../shared'
import CommonsRepository from '../repository/commons.repository'
import { ExamType } from '../repository/entity/examType'
import { Headquarter } from '../repository/entity/headquarter'
import { ICommonsRepository } from '../repository/interfaces/commons.repository.interface'

export default class CommonsService {
  private readonly repository: ICommonsRepository
  private readonly sambaClient: FTPClient

  constructor() {
    this.repository = new CommonsRepository()
    this.sambaClient = new FTPClient()
  }

  async findAllHeadquarters(): Promise<Headquarter[]> {
    let data: Headquarter[] = []

    data = await this.repository.findAllHeadquarters()

    return data
  }

  async findAllExamTypes(): Promise<ExamType[]> {
    let data: ExamType[] = []

    data = await this.repository.findAllExamTypes()

    return data
  }

  async downloadFile(uid: string): Promise<Buffer> {
    try {
      const path = uid
      logger.info('Downloading file from FTP')

      return this.sambaClient.downloadFile(path)
    } catch (error: unknown) {
      logger.error((error as Error).message)
      throw new Error('Error while trying to download file.')
    }
  }

  async findEpidemiologicalReport(
    ruc: string
  ): Promise<EpidemiologicalReport[]> {
    try {
      return this.repository.findEpidemiologicalReport(ruc)
    } catch (error: unknown) {
      throw error
    }
  }

  async downloadEpidemiologicalReport(uid: string): Promise<Buffer> {
    try {
      const path = `INFORMEEPIDEMIOLOGICO/${uid}.pdf`

      logger.info('Downloading epidemiological report file')

      return this.sambaClient.downloadFile(
        path,
        undefined,
        'INFORMEEPIDEMIOLOGICO'
      )
    } catch (error: unknown) {
      logger.error((error as Error).message)

      throw new Error('Error while trying to download epidemiological report.')
    }
  }

  async uploadPhoto(
    buffer: Buffer,
    originalFilename: string,
    _mimetype: string
  ): Promise<string> {
    try {
      const remoteFilePath = `/FOTOUS/${originalFilename}`

      logger.info('Uploading photo')

      const sambaResult = await this.sambaClient.uploadFile(
        buffer,
        remoteFilePath
      )

      logger.info(`SambaClient.uploadFile result: ${String(sambaResult)}`)

      return originalFilename
    } catch (error: unknown) {
      logger.error((error as Error).message)

      throw new Error('Error while trying to upload photo.')
    }
  }

  async getPhoto(photoId: string): Promise<Buffer> {
    try {
      const path = `FOTOUS/${photoId}`

      logger.info('Downloading photo file')

      const fileBuffer = await this.sambaClient.downloadFile(
        path,
        undefined,
        'FOTOUS'
      )

      logger.info(`File downloaded: ${fileBuffer.length} bytes`)

      return fileBuffer
    } catch (error: unknown) {
      logger.error((error as Error).message)

      throw new Error('Error while trying to download photo.')
    }
  }

  async updatePhotoURL(photoURL: string, dni: string): Promise<boolean> {
    try {
      return this.repository.uploadPhoto(photoURL, dni)
    } catch (error: unknown) {
      throw error
    }
  }

  async deletePhoto(photoId: string): Promise<boolean> {
    try {
      const path = `/FOTOUS/${photoId}`

      logger.info('Deleting photo from storage')

      await this.sambaClient.deleteFile(path)

      logger.info('Photo deleted successfully')

      return true
    } catch (error: unknown) {
      logger.error((error as Error).message)

      throw new Error('Error while trying to delete photo.')
    }
  }
}
