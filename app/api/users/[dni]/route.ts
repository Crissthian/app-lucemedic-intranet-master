import { NextRequest, NextResponse } from 'next/server'
import { handleUpdateUser } from '@/src/server/auth/handlers/auth.handlers'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function PUT(request: NextRequest): Promise<NextResponse> {
  return handleUpdateUser(request)
}

