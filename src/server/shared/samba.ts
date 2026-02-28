import * as fs from 'fs/promises'
import * as os from 'os'
import * as path from 'path'
import { execFile } from 'child_process'
import { promisify } from 'util'
import { logger } from './logger'
import {
  FTP_AUDIOMETRY_HOST,
  FTP_AUDIOMETRY_USER,
  FTP_AUDIOMETRY_PASSWORD,
  FTP_AUDIOMETRY_DOMAIN
} from './config'

const execFileAsync = promisify(execFile)
const IS_WINDOWS = os.platform() === 'win32'

// ─── Windows helpers (net use + UNC paths) ───────────────────────────────────

async function winMount(
  host: string,
  share: string,
  user: string,
  password: string,
  domain?: string
): Promise<void> {
  const uncPath = `\\\\${host}\\${share}`
  const fullUser = domain ? `${domain}\\${user}` : user
  try {
    await execFileAsync('net', ['use', uncPath, `/user:${fullUser}`, password, '/persistent:no'])
    logger.info(`SMB mounted ${uncPath} as ${fullUser}`)
  } catch (err: unknown) {
    // System error 2 = already connected — safe to ignore
    const msg = (err as { stderr?: string }).stderr ?? ''
    if (!msg.includes('2')) {
      logger.warn(`SMB net use warning: ${msg.trim()}`)
    }
  }
}

async function winUnmount(host: string, share: string): Promise<void> {
  try {
    await execFileAsync('net', ['use', `\\\\${host}\\${share}`, '/delete', '/yes'])
  } catch {
    // Ignore — share may already be disconnected
  }
}

async function winDownload(
  host: string, share: string, user: string, password: string,
  relPath: string
): Promise<Buffer> {
  const norm = relPath.replace(/\//g, '\\').replace(/^\\/, '')
  await winMount(host, share, user, password, FTP_AUDIOMETRY_DOMAIN)
  try {
    const fullPath = path.win32.join(`\\\\${host}\\${share}`, norm)
    logger.info(`SMB [win] file path: ${fullPath}`)
    return await fs.readFile(fullPath)
  } finally {
    await winUnmount(host, share)
  }
}

async function winUpload(
  host: string, share: string, user: string, password: string,
  relPath: string, buffer: Buffer
): Promise<void> {
  const norm = relPath.replace(/\//g, '\\').replace(/^\\/, '')
  await winMount(host, share, user, password, FTP_AUDIOMETRY_DOMAIN)
  try {
    const fullPath = path.win32.join(`\\\\${host}\\${share}`, norm)
    await fs.writeFile(fullPath, buffer)
  } finally {
    await winUnmount(host, share)
  }
}

// ─── Linux helpers (smbclient — no root required) ────────────────────────────
//
// smbclient uses NTLMv2 + SMB2/3 and delegates auth to the OS Samba stack,
// so it never touches Node.js OpenSSL.

function linuxSmbArgs(
  host: string, share: string, user: string, password: string, domain?: string
): string[] {
  // //${host}/${share} -U [domain/]user%password
  const fullUser = domain ? `${domain}/${user}` : user
  return [`//${host}/${share}`, '-U', `${fullUser}%${password}`, '--option=client min protocol=SMB2']
}

async function linuxDownload(
  host: string, share: string, user: string, password: string,
  relPath: string
): Promise<Buffer> {
  // Normalize to forward-slash for smbclient
  const remotePath = relPath.replace(/\\/g, '/')
  const tmpFile = path.join(os.tmpdir(), `smb_dl_${Date.now()}_${path.basename(remotePath)}`)

  logger.info(`SMB [linux] //${host}/${share}/${remotePath} -> ${tmpFile}`)

  const args = [
    ...linuxSmbArgs(host, share, user, password, FTP_AUDIOMETRY_DOMAIN),
    '-c', `get "${remotePath}" "${tmpFile}"`
  ]

  try {
    await execFileAsync('smbclient', args)
    const buffer = await fs.readFile(tmpFile)
    return buffer
  } finally {
    await fs.unlink(tmpFile).catch(() => undefined)
  }
}

async function linuxUpload(
  host: string, share: string, user: string, password: string,
  relPath: string, buffer: Buffer
): Promise<void> {
  const remotePath = relPath.replace(/\\/g, '/')
  const tmpFile = path.join(os.tmpdir(), `smb_ul_${Date.now()}_${path.basename(remotePath)}`)

  await fs.writeFile(tmpFile, buffer)

  const args = [
    ...linuxSmbArgs(host, share, user, password, FTP_AUDIOMETRY_DOMAIN),
    '-c', `put "${tmpFile}" "${remotePath}"`
  ]

  try {
    await execFileAsync('smbclient', args)
  } finally {
    await fs.unlink(tmpFile).catch(() => undefined)
  }
}

// ─── Public API ───────────────────────────────────────────────────────────────

export class SMBClient {
  async downloadFile(
    remoteFilePath: string,
    host?: string,
    share?: string,
    _extension?: string,
    user?: string,
    password?: string
  ): Promise<Buffer> {
    const hostToUse = host ?? FTP_AUDIOMETRY_HOST
    const userToUse = user ?? FTP_AUDIOMETRY_USER
    const passwordToUse = password ?? FTP_AUDIOMETRY_PASSWORD
    const shareToUse = share ?? 'graficosotorrino'

    logger.info(`SMB connecting to \\\\${hostToUse}\\${shareToUse} as ${userToUse}`)

    try {
      const buffer = IS_WINDOWS
        ? await winDownload(hostToUse, shareToUse, userToUse, passwordToUse, remoteFilePath)
        : await linuxDownload(hostToUse, shareToUse, userToUse, passwordToUse, remoteFilePath)

      logger.info(`SMB file downloaded (${buffer.length} bytes)`)
      return buffer
    } catch (error: unknown) {
      logger.error(`SMB Error while downloading file: ${(error as Error).message}`)
      throw error
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
    const hostToUse = host ?? FTP_AUDIOMETRY_HOST
    const userToUse = user ?? FTP_AUDIOMETRY_USER
    const passwordToUse = password ?? FTP_AUDIOMETRY_PASSWORD
    const shareToUse = share ?? 'graficosotorrino'

    try {
      if (IS_WINDOWS) {
        await winUpload(hostToUse, shareToUse, userToUse, passwordToUse, remoteFilePath, buffer)
      } else {
        await linuxUpload(hostToUse, shareToUse, userToUse, passwordToUse, remoteFilePath, buffer)
      }
      logger.info('SMB file uploaded')
      return true
    } catch (error: unknown) {
      throw new Error((error as Error).message)
    }
  }
}
