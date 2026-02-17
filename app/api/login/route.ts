import { NextRequest, NextResponse } from 'next/server'
import { handleLogin } from '@/src/server/auth/handlers/auth.handlers'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest): Promise<NextResponse> {
  return handleLogin(request)
}

