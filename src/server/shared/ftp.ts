import * as ftp from 'basic-ftp'
import crypto from 'crypto'
import { existsSync, mkdirSync } from 'fs'
import { logger } from './logger'
import { FTP_HOST, FTP_PASSWORD, FTP_USER } from './config'

export class FTPClient {
  constructor() {
    // No shared client instance - create new client per operation
  }

  async downloadFile(
    remoteFilePath: string,
    host?: string,
    _subfolder?: string,
    extension?: string
  ): Promise<string> {
    const client = new ftp.Client()
    client.ftp.verbose = true

    try {
      // Ensure temp directory exists
      if (!existsSync('./temp')) {
        mkdirSync('./temp', { recursive: true })
      }

      const fileName = `${crypto.randomUUID().toString()}.${extension || 'pdf'}`
      const localFilePath = `./temp/${fileName}`

      const hostToUse = host || FTP_HOST
      const userToUse = FTP_USER
      const passwordToUse = FTP_PASSWORD

      await client.access({
        host: hostToUse,
        user: userToUse,
        password: passwordToUse,
        secure: false
      })

      logger.info(
        `Connected to FTP ${hostToUse}. Downloading: ftp://${hostToUse}${remoteFilePath}`
      )

      await client.downloadTo(localFilePath, remoteFilePath)

      logger.info(`File downloaded: ${remoteFilePath} | ${localFilePath}`)

      return fileName
    } catch (error: unknown) {
      logger.error(
        `FTP Error while downloading file ${remoteFilePath}: ${error}`
      )
      throw error
    } finally {
      client.close()
    }
  }

  async uploadFile(
    localFilePath: string,
    remoteFilePath: string
  ): Promise<boolean> {
    const client = new ftp.Client()
    client.ftp.verbose = true

    try {
      const hostToUse = FTP_HOST
      const userToUse = FTP_USER
      const passwordToUse = FTP_PASSWORD

      await client.access({
        host: hostToUse,
        user: userToUse,
        password: passwordToUse,
        secure: false
      })

      logger.info(
        `Connected to FTP ${hostToUse}. Uploading to: ftp://${hostToUse}${remoteFilePath}`
      )

      // Ensure the remote directory exists before uploading
      const remoteDir = remoteFilePath.substring(
        0,
        remoteFilePath.lastIndexOf('/')
      )
      if (remoteDir) {
        await client.ensureDir(remoteDir)
        await client.cd('/')
      }

      await client.uploadFrom(localFilePath, remoteFilePath)

      logger.info(`File uploaded: ${localFilePath} | ${remoteFilePath}`)

      return true
    } catch (error: unknown) {
      logger.error(`FTP Error while uploading file ${remoteFilePath}: ${error}`)
      throw error
    } finally {
      client.close()
    }
  }

  async deleteFile(remoteFilePath: string): Promise<boolean> {
    const client = new ftp.Client()
    client.ftp.verbose = true

    try {
      const hostToUse = FTP_HOST
      const userToUse = FTP_USER
      const passwordToUse = FTP_PASSWORD

      await client.access({
        host: hostToUse,
        user: userToUse,
        password: passwordToUse,
        secure: false
      })

      logger.info(
        `Connected to FTP ${hostToUse}. Deleting: ftp://${hostToUse}${remoteFilePath}`
      )

      await client.remove(remoteFilePath)

      logger.info(`File deleted: ${remoteFilePath}`)

      return true
    } catch (error: unknown) {
      logger.error(`FTP Error while deleting file ${remoteFilePath}: ${error}`)
      throw error
    } finally {
      client.close()
    }
  }
}
