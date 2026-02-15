import SambaClient from 'samba-client'
import crypto from 'crypto'
import { existsSync, mkdirSync } from 'fs'
import { logger } from './logger'
import { FILE_SYSTEM_SERVER, FILE_SYSTEM_SERVER_PASSWORD, FILE_SYSTEM_SERVER_USERNAME } from './config'

export class SMBClient {
  private connection: SambaClient

  constructor() {
    this.connection = new SambaClient({
      address: `\\\\${FILE_SYSTEM_SERVER}\\empresas`,
      domain: 'WORKGROUP',
      username: FILE_SYSTEM_SERVER_USERNAME,
      password: FILE_SYSTEM_SERVER_PASSWORD
    })
  }

  async downloadFile(remoteFilePath: string, host?: string, subfolder?: string, extension?: string): Promise<string> {
    try {
      if (!existsSync('./temp')) {
        mkdirSync('./temp', { recursive: true })
      }

      const fileName = `${crypto.randomUUID().toString()}.${extension || 'pdf'}`
      const localFilePath = `./temp/${fileName}`

      if (host) {
        const address = host === FILE_SYSTEM_SERVER ? `\\\\${FILE_SYSTEM_SERVER}\\empresas` : `\\\\${host}\\${subfolder}`
        const username = host === FILE_SYSTEM_SERVER ? FILE_SYSTEM_SERVER_USERNAME : 'administrador'
        const password = host === FILE_SYSTEM_SERVER ? FILE_SYSTEM_SERVER_PASSWORD : 'luc3'

        const options = {
          address,
          domain: 'WORKGROUP',
          username,
          password
        }

        logger.info(`Connecting options: ${JSON.stringify(options)}`)

        this.connection = new SambaClient(options)
      }

      await this.connection.getFile(remoteFilePath, localFilePath)

      logger.info(`File downloaded: ${remoteFilePath} | ${localFilePath}`)

      return fileName
    } catch (error: unknown) {
      logger.error(`Samba Error while downloading file ${remoteFilePath}: ${error}`)
      throw error
    }
  }

  async uploadFile(localFilePath: string, remoteFilePath: string): Promise<boolean> {
    try {
      let success = true

      await this.connection.sendFile(localFilePath, remoteFilePath)

      logger.info(`File uploaded: ${localFilePath} | ${remoteFilePath}`)

      return success
    } catch (error: unknown) {
      throw new Error((error as Error).message)
    }
  }
}


