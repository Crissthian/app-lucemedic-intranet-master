import { NextRequest, NextResponse } from 'next/server'
import { handleHeadquarters } from '@/src/server/commons/handlers/commons.handlers'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest): Promise<NextResponse> {
  return handleHeadquarters(request)
}

