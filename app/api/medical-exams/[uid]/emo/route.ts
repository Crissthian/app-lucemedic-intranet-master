import { NextRequest, NextResponse } from 'next/server'
import { handleDownloadEMO } from '@/src/server/medical-exams/handlers/medical-exams.handlers'

type RouteContext = {
  params: {
    uid: string
  }
}

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(
  request: NextRequest,
  { params }: RouteContext
): Promise<NextResponse> {
  return handleDownloadEMO(request, params.uid)
}
