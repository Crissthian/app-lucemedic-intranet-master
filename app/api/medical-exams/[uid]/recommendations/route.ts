import { NextRequest, NextResponse } from 'next/server'
import { handleFindRecommendations } from '@/src/server/medical-exams/handlers/medical-exams.handlers'

type RouteContext = {
  params: {
    uid: string
  }
}

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(
  request: NextRequest,
  { params }: RouteContext
): Promise<NextResponse> {
  return handleFindRecommendations(request, params.uid)
}
