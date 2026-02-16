import { NextRequest, NextResponse } from 'next/server'
import * as ftp from 'basic-ftp'
import { FTP_HOST, FTP_USER, FTP_PASSWORD, logger } from '@/src/server/shared'
import { authenticateRequest } from '@/src/server/http/auth'
import path from 'path'
import { Writable } from 'stream'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
): Promise<NextResponse> {
  const auth = authenticateRequest(request)

  if (!auth.ok) {
    return auth.response
  }

  const { filename } = await params

  // Clean filename to prevent path traversal
  const cleanFilename = path.basename(filename)

  const client = new ftp.Client()
  client.ftp.verbose = false

  const remoteFilePath = `/FOTOUS/${cleanFilename}`
  const ext = path.extname(cleanFilename).substring(1).toLowerCase()

  try {
    await client.access({
      host: FTP_HOST,
      user: FTP_USER,
      password: FTP_PASSWORD,
      secure: false
    })

    logger.info(`Downloading photo from: ftp://${FTP_HOST}${remoteFilePath}`)

    // Download directly to memory using a buffer
    const chunks: Buffer[] = []
    const writableStream = new Writable({
      write(chunk, encoding, callback) {
        chunks.push(Buffer.from(chunk))
        callback()
      }
    })

    await client.downloadTo(writableStream, remoteFilePath)

    const fileBuffer = Buffer.concat(chunks)

    // Determine content type based on extension
    let contentType = 'image/jpeg'
    if (ext === 'png') contentType = 'image/png'
    if (ext === 'gif') contentType = 'image/gif'
    if (ext === 'webp') contentType = 'image/webp'
    if (ext === 'svg') contentType = 'image/svg+xml'

    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable'
      }
    })
  } catch (error: any) {
    logger.error(`Error serving photo ${filename}: ${error.message}`)
    return new NextResponse('Photo not found', { status: 404 })
  } finally {
    client.close()
  }
}
