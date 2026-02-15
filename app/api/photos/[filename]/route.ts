import { NextRequest, NextResponse } from 'next/server'
import * as ftp from 'basic-ftp'
import { FTP_HOST, FTP_USER, FTP_PASSWORD, logger } from '@/src/server/shared'
import path from 'path'
import { existsSync, mkdirSync } from 'fs'
import fs from 'fs/promises'
import crypto from 'crypto'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
): Promise<NextResponse> {
  const { filename } = await params

  // Clean filename to prevent path traversal
  const cleanFilename = path.basename(filename)

  const client = new ftp.Client()
  client.ftp.verbose = false

  const tempDir = path.join(process.cwd(), 'temp')
  if (!existsSync(tempDir)) {
    mkdirSync(tempDir, { recursive: true })
  }

  const ext = path.extname(cleanFilename).substring(1)
  const localFileName = `${crypto.randomUUID()}.${ext}`
  const localFilePath = path.join(tempDir, localFileName)
  const remoteFilePath = `/FOTOUS/${cleanFilename}`

  try {
    await client.access({
      host: FTP_HOST,
      user: FTP_USER,
      password: FTP_PASSWORD,
      secure: false
    })

    logger.info(`Downloading photo from: ftp://${FTP_HOST}${remoteFilePath}`)

    await client.downloadTo(localFilePath, remoteFilePath)

    const fileBuffer = await fs.readFile(localFilePath)

    let contentType = 'image/jpeg'
    const lowerExt = ext?.toLowerCase()

    if (lowerExt === 'png') contentType = 'image/png'
    if (lowerExt === 'gif') contentType = 'image/gif'
    if (lowerExt === 'webp') contentType = 'image/webp'
    if (lowerExt === 'svg') contentType = 'image/svg+xml'

    await fs.unlink(localFilePath).catch(() => {})

    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable'
      }
    })
  } catch (error: any) {
    logger.error(`Error serving photo ${filename}: ${error.message}`)

    if (existsSync(localFilePath)) {
      await fs.unlink(localFilePath).catch(() => {})
    }

    return new NextResponse('Photo not found', { status: 404 })
  } finally {
    client.close()
  }
}

