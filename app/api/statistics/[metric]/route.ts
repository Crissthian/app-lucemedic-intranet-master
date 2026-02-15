import { NextRequest, NextResponse } from 'next/server'
import { handleStatisticsMetric } from '@/src/server/statistics/handlers/statistics.handlers'

type RouteContext = {
  params: {
    metric: string
  }
}

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(
  request: NextRequest,
  { params }: RouteContext
): Promise<NextResponse> {
  return handleStatisticsMetric(request, params.metric)
}
