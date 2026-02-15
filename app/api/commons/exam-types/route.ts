import { NextRequest, NextResponse } from 'next/server'
import { handleExamTypes } from '@/src/server/commons/handlers/commons.handlers'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest): Promise<NextResponse> {
  return handleExamTypes(request)
}

