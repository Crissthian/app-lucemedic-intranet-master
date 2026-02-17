import { NextRequest, NextResponse } from 'next/server'
import {
  handleGetPhoto,
  handleDeletePhoto
} from '@/src/server/commons/handlers/commons.handlers'

type RouteContext = {
  params: Promise<{
    photoId: string
  }>
}

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(
  request: NextRequest,
  { params }: RouteContext
): Promise<NextResponse> {
  const routeParams = await params

  return handleGetPhoto(request, routeParams.photoId)
}

export async function DELETE(
  request: NextRequest,
  { params }: RouteContext
): Promise<NextResponse> {
  const routeParams = await params

  return handleDeletePhoto(request, routeParams.photoId)
}

