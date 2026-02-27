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
    _extension?: string,
    user?: string,
    password?: string
  ): Promise<Buffer> {
    const client = new ftp.Client()
    client.ftp.verbose = true

    try {
      const hostToUse = host || FTP_HOST
      const userToUse = user ?? FTP_USER
      const passwordToUse = password ?? FTP_PASSWORD

      await client.access({
        host: hostToUse,
        user: userToUse,
        password: passwordToUse,
        secure: false
      })

      logger.info('Connected to FTP. Starting file download')

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

      logger.info(`File downloaded to memory (${fileBuffer.length} bytes)`)

      return fileBuffer
    } catch (error: unknown) {
      logger.error(`FTP Error while downloading file: ${error}`)
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

      logger.info('Connected to FTP. Starting file upload')

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

      logger.info('File uploaded from memory')

      return true
    } catch (error: unknown) {
      logger.error(`FTP Error while uploading file: ${error}`)
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

      logger.info('Connected to FTP. Deleting file')

      await client.remove(remoteFilePath)

      logger.info('File deleted')

      return true
    } catch (error: unknown) {
      logger.error(`FTP Error while deleting file: ${error}`)
      throw error
    } finally {
      client.close()
    }
  }
}
