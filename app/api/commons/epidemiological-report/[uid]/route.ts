import { NextRequest, NextResponse } from 'next/server'
import { handleDownloadEpidemiologicalReport } from '@/src/server/commons/handlers/commons.handlers'

type RouteContext = {
  params: {
    uid: string
  }
}

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(
  request: NextRequest,
  { params }: RouteContext
): Promise<NextResponse> {
  return handleDownloadEpidemiologicalReport(request, params.uid)
}
