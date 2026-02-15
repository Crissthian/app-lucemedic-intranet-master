import { readFileSync } from 'fs'
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
    const file = readFileSync(`./temp/${uid}`)

    if (file.length > 0) {
      return file
    }

    return Buffer.from('')
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

  async downloadEpidemiologicalReport(uid: string): Promise<string> {
    try {
      const path = `INFORMEEPIDEMIOLOGICO/${uid}.pdf`

      logger.info(`Downloading file from: ${path}`)

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

  async uploadPhoto(localFilePath: string, mimetype: string): Promise<string> {
    try {
      const fileName = localFilePath.split('/').pop() || `photo_${Date.now()}`

      // The temp file already has the correct extension from getUploadData,
      // so we don't need to append another one based on mimetype.

      const remoteFilePath = `/FOTOUS/${fileName}`

      logger.info(`Uploading photo to: ${remoteFilePath}`)

      const sambaResult = await this.sambaClient.uploadFile(
        localFilePath,
        remoteFilePath
      )

      logger.info(
        `SambaClient.uploadFile result: ${JSON.stringify(sambaResult)}`
      )

      return fileName
    } catch (error: unknown) {
      logger.error((error as Error).message)

      throw new Error('Error while trying to upload photo.')
    }
  }

  async getPhoto(photoId: string): Promise<string> {
    try {
      const path = `FOTOUS/${photoId}`
      const extension = photoId.split('.').pop() || 'jpg'

      logger.info(`Downloading file from: ${path}`)

      const file = this.sambaClient.downloadFile(
        path,
        undefined,
        'FOTOUS',
        extension
      )

      logger.info(`File: ${file}`)

      return file
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

      logger.info(`Deleting photo from: ${path}`)

      await this.sambaClient.deleteFile(path)

      logger.info(`Photo deleted successfully: ${photoId}`)

      return true
    } catch (error: unknown) {
      logger.error((error as Error).message)

      throw new Error('Error while trying to delete photo.')
    }
  }
}
