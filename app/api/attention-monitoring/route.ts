import { NextRequest, NextResponse } from 'next/server'
import { handleFindAttentionMonitoring } from '@/src/server/attention-monitoring/handlers/attention-monitoring.handlers'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest): Promise<NextResponse> {
  return handleFindAttentionMonitoring(request)
}
