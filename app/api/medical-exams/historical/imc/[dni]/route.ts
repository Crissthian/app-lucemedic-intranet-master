import { NextRequest, NextResponse } from 'next/server'
import { handleHistoricalImc } from '@/src/server/medical-exams/handlers/historical.handlers'

type RouteContext = {
  params: {
    dni: string
  }
}

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest, { params }: RouteContext): Promise<NextResponse> {
  return handleHistoricalImc(request, params.dni)
}
