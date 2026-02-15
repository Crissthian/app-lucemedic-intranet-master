import { NextRequest, NextResponse } from 'next/server'
import { handleDownloadFile } from '@/src/server/commons/handlers/commons.handlers'

type RouteContext = {
  params: Promise<{
    uid: string
  }>
}

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(
  request: NextRequest,
  { params }: RouteContext
): Promise<NextResponse> {
  const routeParams = await params

  return handleDownloadFile(request, routeParams.uid)
}

