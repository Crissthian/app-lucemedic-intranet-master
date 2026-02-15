import { NextRequest, NextResponse } from 'next/server'
import { AttentionMonitoringQueryDTO } from '@/src/server/attention-monitoring/dto/attention-monitoring.query.dto'
import AttentionMonitoringService from '@/src/server/attention-monitoring/services/attention-monitoring.service'
import { authenticateRequest } from '@/src/server/http/auth'
import { logger } from '@/src/server/shared'

const attentionMonitoringService = new AttentionMonitoringService()

function getQueryObject(request: NextRequest): Record<string, string> {
  const result: Record<string, string> = {}

  request.nextUrl.searchParams.forEach((value, key) => {
    result[key] = value
  })

  return result
}

export async function handleFindAttentionMonitoring(
  request: NextRequest
): Promise<NextResponse> {
  const auth = authenticateRequest(request)

  if (!auth.ok) {
    return auth.response
  }

  try {
    const query = getQueryObject(
      request
    ) as unknown as AttentionMonitoringQueryDTO
    const ruc = String(auth.user.ruc ?? '')

    logger.info(
      `Getting attention monitoring: ${JSON.stringify(query)} | ${ruc}`
    )

    const attention_monitoring = await attentionMonitoringService.find(
      query,
      ruc
    )

    return NextResponse.json(
      {
        status: true,
        data: {
          attention_monitoring
        }
      },
      { status: 200 }
    )
  } catch (error: unknown) {
    logger.error('Error while trying to get attention monitoring.')
    logger.error((error as Error).message)

    return NextResponse.json(
      {
        status: false,
        message: 'Error while trying to get attention monitoring.'
      },
      { status: 500 }
    )
  }
}
