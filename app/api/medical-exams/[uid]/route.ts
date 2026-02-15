import { NextRequest, NextResponse } from 'next/server'
import { handleFindMedicalExam } from '@/src/server/medical-exams/handlers/medical-exams.handlers'

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
  return handleFindMedicalExam(request, params.uid)
}
