import { NextRequest, NextResponse } from 'next/server'
import { handleUploadPhoto } from '@/src/server/commons/handlers/commons.handlers'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function PATCH(request: NextRequest): Promise<NextResponse> {
  return handleUploadPhoto(request)
}
