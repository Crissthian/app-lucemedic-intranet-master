import { NextRequest, NextResponse } from 'next/server'
import { handleHistoricalRadiology } from '@/src/server/medical-exams/handlers/historical.handlers'

type RouteContext = {
  params: Promise<{
    dni: string
  }>
}

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(
  request: NextRequest,
  { params }: RouteContext
): Promise<NextResponse> {
  const routeParams = await params

  return handleHistoricalRadiology(request, routeParams.dni)
}

