import { NextRequest, NextResponse } from 'next/server'
import { handleDownloadCertificado } from '@/src/server/medical-exams/handlers/medical-exams.handlers'

type RouteContext = {
  params: Promise<{
    uid: string
  }>
}

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(
  request: NextRequest,
  { params }: RouteContext
): Promise<NextResponse> {
  const routeParams = await params

  return handleDownloadCertificado(request, routeParams.uid)
}

