import { NextRequest, NextResponse } from 'next/server'
import { GetDownloadsDTO } from '@/src/server/commons/dto/get-downloads.dto'
import AttachmentsService from '@/src/server/attachments/services/attachments.service'
import { logger } from '@/src/server/shared'

const attachmentsService = new AttachmentsService()

async function parseJsonBody(request: NextRequest): Promise<Record<string, unknown>> {
  try {
    return (await request.json()) as Record<string, unknown>
  } catch {
    return {}
  }
}

export async function handleDownloadAttachment(
  request: NextRequest,
): Promise<NextResponse> {
  try {
    const payload = (await parseJsonBody(request)) as unknown as GetDownloadsDTO
    const zipBuffer = await attachmentsService.downloadAttachment(payload)
    const fileName = `lucemedic_${new Date().getTime()}.zip`

    return new NextResponse(new Uint8Array(zipBuffer), {
      status: 200,
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename=${fileName}`,
      },
    })
  } catch (error: unknown) {
    logger.error((error as Error).message)

    return NextResponse.json(
      {
        status: false,
        message:
          (error as Error).message || 'Error while trying download attachment',
      },
      { status: 500 },
    )
  }
}
