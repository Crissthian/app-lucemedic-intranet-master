import { NextRequest, NextResponse } from 'next/server'
import {
  handleFindMedicalExams
} from '@/src/server/medical-exams/handlers/medical-exams.handlers'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest): Promise<NextResponse> {
  return handleFindMedicalExams(request)
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  void request

  return NextResponse.json(
    {
      status: false,
      message: 'Endpoint disabled for security reasons.'
    },
    { status: 403 }
  )
}

