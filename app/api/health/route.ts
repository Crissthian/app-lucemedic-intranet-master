import { NextRequest, NextResponse } from 'next/server'
import { logger } from '@/src/server/shared'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(_request: NextRequest): Promise<NextResponse> {
  logger.info('Health check endpoint called')

  return new NextResponse('OK', {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8'
    }
  })
}

