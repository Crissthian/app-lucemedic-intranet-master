import { NextRequest, NextResponse } from 'next/server'
import { handleSabanaInterconsultations } from '@/src/server/sabana/handlers/sabana.handlers'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest): Promise<NextResponse> {
  return handleSabanaInterconsultations(request)
}

