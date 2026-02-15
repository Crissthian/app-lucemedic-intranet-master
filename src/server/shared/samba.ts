import { Readable, Writable } from 'stream'
import * as ftp from 'basic-ftp'
import { logger } from './logger'
import { FTP_HOST, FTP_PASSWORD, FTP_USER } from './config'

export class SMBClient {
  constructor() {
    // Uses FTP protocol directly instead of Samba
  }

  async downloadFile(
    remoteFilePath: string,
    _host?: string,
    _subfolder?: string,
    _extension?: string
  ): Promise<Buffer> {
    const client = new ftp.Client()
    client.ftp.verbose = false

    try {
      await client.access({
        host: FTP_HOST,
        user: FTP_USER,
        password: FTP_PASSWORD,
        secure: false
      })

      logger.info(
        `Connected to FTP ${FTP_HOST}. Downloading: ftp://${FTP_HOST}${remoteFilePath}`
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
    client.ftp.verbose = false

    try {
      await client.access({
        host: FTP_HOST,
        user: FTP_USER,
        password: FTP_PASSWORD,
        secure: false
      })

      logger.info(
        `Connected to FTP ${FTP_HOST}. Uploading to: ftp://${FTP_HOST}${remoteFilePath}`
      )

      // Upload from memory using a Readable stream
      const readableStream = Readable.from(buffer)
      await client.uploadFrom(readableStream, remoteFilePath)

      logger.info(`File uploaded from memory to: ${remoteFilePath}`)

      return true
    } catch (error: unknown) {
      throw new Error((error as Error).message)
    } finally {
      client.close()
    }
  }
}
