import { NextRequest, NextResponse } from 'next/server'
import { handleVerify } from '@/src/server/auth/handlers/auth.handlers'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest): Promise<NextResponse> {
  return handleVerify(request)
}

