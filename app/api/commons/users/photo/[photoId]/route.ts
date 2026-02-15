import { NextRequest, NextResponse } from 'next/server'
import {
  handleGetPhoto,
  handleDeletePhoto
} from '@/src/server/commons/handlers/commons.handlers'

type RouteContext = {
  params: {
    photoId: string
  }
}

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(
  request: NextRequest,
  { params }: RouteContext
): Promise<NextResponse> {
  return handleGetPhoto(request, params.photoId)
}

export async function DELETE(
  request: NextRequest,
  { params }: RouteContext
): Promise<NextResponse> {
  return handleDeletePhoto(request, params.photoId)
}
