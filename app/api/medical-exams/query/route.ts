import { NextRequest, NextResponse } from 'next/server'
import { handleMedicalExamsQuery } from '@/src/server/medical-exams/handlers/medical-exams.handlers'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest): Promise<NextResponse> {
  return handleMedicalExamsQuery(request)
}
