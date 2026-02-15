import { NextRequest, NextResponse } from 'next/server'
import { handleUpdateProfilePhoto } from '@/src/server/auth/handlers/auth.handlers'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function PATCH(request: NextRequest): Promise<NextResponse> {
  return handleUpdateProfilePhoto(request)
}

