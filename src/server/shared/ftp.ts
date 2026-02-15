import * as ftp from 'basic-ftp'
import { Readable, Writable } from 'stream'
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
    _extension?: string
  ): Promise<Buffer> {
    const client = new ftp.Client()
    client.ftp.verbose = true

    try {
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

      // Download directly to memory
      const chunks: Buffer[] = []
      const writableStream = new Writable({
        write(chunk, _encoding, callback) {
          chunks.push(Buffer.from(chunk))
          callback()
        }
      })

      await client.downloadTo(writableStream, remoteFilePath)

      const fileBuffer = Buffer.concat(chunks)

      logger.info(
        `File downloaded to memory: ${remoteFilePath} (${fileBuffer.length} bytes)`
      )

      return fileBuffer
    } catch (error: unknown) {
      logger.error(
        `FTP Error while downloading file ${remoteFilePath}: ${error}`
      )
      throw error
    } finally {
      client.close()
    }
  }

  async uploadFile(buffer: Buffer, remoteFilePath: string): Promise<boolean> {
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

      // Upload from memory using a Readable stream
      const readableStream = Readable.from(buffer)
      await client.uploadFrom(readableStream, remoteFilePath)

      logger.info(`File uploaded from memory to: ${remoteFilePath}`)

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
