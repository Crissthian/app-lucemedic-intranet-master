import { exec } from 'child_process'
import { readFile, writeFile } from 'fs/promises'
import { promisify } from 'util'
import { logger } from './logger'
import {
  FTP_AUDIOMETRY_HOST,
  FTP_AUDIOMETRY_USER,
  FTP_AUDIOMETRY_PASSWORD
} from './config'

const execAsync = promisify(exec)

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

    // Normalize path: replace forward slashes with backslashes and remove leading slash
    const normalizedPath = remoteFilePath.replace(/\//g, '\\').replace(/^\\/, '')
    const uncShare = `\\\\${hostToUse}\\${shareToUse}`
    const uncFilePath = `${uncShare}\\${normalizedPath}`

    logger.info(`SMB connecting to ${uncShare} as ${userToUse}`)
    logger.info(`SMB file path: ${uncFilePath}`)

    try {
      // Limpiar todas las sesiones previas al servidor
      try {
        await execAsync(`net use \\\\${hostToUse}\\* /delete /yes`)
      } catch { /* no había sesiones previas */ }
      try {
        await execAsync(`cmdkey /delete:${hostToUse}`)
      } catch { /* ignorar */ }

      // Authenticate to the share
      await execAsync(
        `net use "${uncShare}" "${passwordToUse}" /user:"${userToUse}" /persistent:no`
      )
      logger.info('SMB share mounted')

      // Read the file directly via UNC path
      const fileBuffer = await readFile(uncFilePath)
      logger.info(`SMB file downloaded (${fileBuffer.length} bytes)`)

      return fileBuffer
    } catch (error: unknown) {
      logger.error(`SMB Error while downloading file: ${(error as Error).message}`)
      throw error
    } finally {
      // Disconnect share
      try {
        await execAsync(`net use "${uncShare}" /delete /yes`)
      } catch {
        // Ignore disconnect errors
      }
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
    const uncShare = `\\\\${hostToUse}\\${shareToUse}`
    const uncFilePath = `${uncShare}\\${normalizedPath}`

    try {
      await execAsync(
        `net use "${uncShare}" "${passwordToUse}" /user:"${userToUse}" /persistent:no`
      )
      await writeFile(uncFilePath, buffer)
      logger.info('SMB file uploaded')
      return true
    } catch (error: unknown) {
      throw new Error((error as Error).message)
    } finally {
      try {
        await execAsync(`net use "${uncShare}" /delete /yes`)
      } catch {
        // Ignore disconnect errors
      }
    }
  }
}
