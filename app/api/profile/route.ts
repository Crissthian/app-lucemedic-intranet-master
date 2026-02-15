import { NextRequest, NextResponse } from 'next/server'
import { handleProfile } from '@/src/server/auth/handlers/auth.handlers'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest): Promise<NextResponse> {
  return handleProfile(request)
}
