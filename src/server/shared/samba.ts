import SMB2 from '@marsaud/smb2'
import { logger } from './logger'
import {
  FTP_AUDIOMETRY_HOST,
  FTP_AUDIOMETRY_USER,
  FTP_AUDIOMETRY_PASSWORD
} from './config'

function createClient(host: string, share: string, user: string, password: string): SMB2 {
  return new SMB2({
    share: `\\\\${host}\\${share}`,
    domain: '',
    username: user,
    password,
    autoCloseTimeout: 5000
  })
}

export class SMBClient {
  async downloadFile(
    remoteFilePath: string,
    host?: string,
    share?: string,
    _extension?: string,
    user?: string,
    password?: string
  ): Promise<Buffer> {
    const hostToUse = host || FTP_AUDIOMETRY_HOST
    const userToUse = user || FTP_AUDIOMETRY_USER
    const passwordToUse = password || FTP_AUDIOMETRY_PASSWORD
    const shareToUse = share || 'graficosotorrino'

    // Normalize to backslash path, strip any leading slash
    const normalizedPath = remoteFilePath.replace(/\//g, '\\').replace(/^\\/, '')

    logger.info(`SMB connecting to \\\\${hostToUse}\\${shareToUse} as ${userToUse}`)
    logger.info(`SMB file path: \\\\${hostToUse}\\${shareToUse}\\${normalizedPath}`)

    const client = createClient(hostToUse, shareToUse, userToUse, passwordToUse)

    try {
      const fileBuffer = await client.readFile(normalizedPath)
      logger.info(`SMB file downloaded (${fileBuffer.length} bytes)`)
      return fileBuffer
    } catch (error: unknown) {
      logger.error(`SMB Error while downloading file: ${(error as Error).message}`)
      throw error
    } finally {
      client.disconnect()
    }
  }

  async uploadFile(
    buffer: Buffer,
    remoteFilePath: string,
    host?: string,
    share?: string,
    user?: string,
    password?: string
  ): Promise<boolean> {
    const hostToUse = host || FTP_AUDIOMETRY_HOST
    const userToUse = user || FTP_AUDIOMETRY_USER
    const passwordToUse = password || FTP_AUDIOMETRY_PASSWORD
    const shareToUse = share || 'graficosotorrino'

    const normalizedPath = remoteFilePath.replace(/\//g, '\\').replace(/^\\/, '')

    const client = createClient(hostToUse, shareToUse, userToUse, passwordToUse)

    try {
      await client.writeFile(normalizedPath, buffer)
      logger.info('SMB file uploaded')
      return true
    } catch (error: unknown) {
      throw new Error((error as Error).message)
    } finally {
      client.disconnect()
    }
  }
}
