import { NextRequest, NextResponse } from 'next/server'
import { handleDownloadConsultation } from '@/src/server/medical-exams/handlers/medical-exams.handlers'

type RouteContext = {
  params: {
    uid: string
    fileId: string
  }
}

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest, { params }: RouteContext): Promise<NextResponse> {
  return handleDownloadConsultation(request, params.uid, params.fileId)
}
