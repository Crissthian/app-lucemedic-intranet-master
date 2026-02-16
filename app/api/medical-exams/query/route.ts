import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

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

