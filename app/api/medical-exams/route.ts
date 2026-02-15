import { NextRequest, NextResponse } from 'next/server'
import { handleFindMedicalExams, handleMedicalExamsQuery } from '@/src/server/medical-exams/handlers/medical-exams.handlers'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest): Promise<NextResponse> {
  return handleFindMedicalExams(request)
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  return handleMedicalExamsQuery(request)
}
