import { NextRequest, NextResponse } from 'next/server'
import { handleDownloadAttachment } from '@/src/server/attachments/handlers/attachments.handlers'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest): Promise<NextResponse> {
  return handleDownloadAttachment(request)
}

