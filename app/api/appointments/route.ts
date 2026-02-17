import { NextRequest, NextResponse } from 'next/server'
import { handleCreateAppointment } from '@/src/server/appointments/handlers/appointments.handlers'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest): Promise<NextResponse> {
  return handleCreateAppointment(request)
}

