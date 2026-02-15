import { NextRequest, NextResponse } from 'next/server'
import { handleHistoricalAudiometry } from '@/src/server/medical-exams/handlers/historical.handlers'

type RouteContext = {
  params: {
    dni: string
  }
}

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest, { params }: RouteContext): Promise<NextResponse> {
  return handleHistoricalAudiometry(request, params.dni)
}
