import { NextRequest, NextResponse } from 'next/server'
import { handleDownloadConsultation } from '@/src/server/medical-exams/handlers/medical-exams.handlers'

type RouteContext = {
  params: Promise<{
    uid: string
    fileId: string
  }>
}

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(
  request: NextRequest,
  { params }: RouteContext
): Promise<NextResponse> {
  const routeParams = await params

  return handleDownloadConsultation(request, routeParams.uid, routeParams.fileId)
}

