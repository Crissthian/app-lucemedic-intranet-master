import { NextRequest, NextResponse } from 'next/server'
import { AptitudQueryDTO } from '@/src/server/sabana/dto/aptitud.query.dto'
import { SabanaQueryDTO } from '@/src/server/sabana/dto/sabana.query.dto'
import SabanaService from '@/src/server/sabana/services/sabana.service'
import { authenticateRequest } from '@/src/server/http/auth'
import { logger } from '@/src/server/shared'

const sabanaService = new SabanaService()

function getQueryObject(request: NextRequest): Record<string, string> {
  const result: Record<string, string> = {}

  request.nextUrl.searchParams.forEach((value, key) => {
    result[key] = value
  })

  return result
}

export async function handleSabana(request: NextRequest): Promise<NextResponse> {
  const auth = authenticateRequest(request)

  if (!auth.ok) {
    return auth.response
  }

  try {
    const query = getQueryObject(request) as unknown as SabanaQueryDTO
    const ruc = String(auth.user.ruc ?? '')

    logger.info(`Getting sabana: ${JSON.stringify(query)} | ${ruc}`)

    const sabana = await sabanaService.find(query, ruc)

    return NextResponse.json(
      {
        status: true,
        data: {
          sabana,
        },
      },
      { status: 200 },
    )
  } catch (error: unknown) {
    logger.error('Error while trying to get sabana.')
    logger.error((error as Error).message)

    return NextResponse.json(
      {
        status: false,
        message: 'Error while trying to get sabana.',
      },
      { status: 500 },
    )
  }
}

export async function handleSabanaAptitud(
  request: NextRequest,
): Promise<NextResponse> {
  const auth = authenticateRequest(request)

  if (!auth.ok) {
    return auth.response
  }

  try {
    const query = getQueryObject(request) as unknown as AptitudQueryDTO
    const ruc = String(auth.user.ruc ?? '')

    logger.info(`Getting aptitud médica: ${JSON.stringify(query)} | ${ruc}`)

    const aptitudes = await sabanaService.findAptitud(query, ruc)

    return NextResponse.json(
      {
        status: true,
        data: {
          aptitudes,
        },
      },
      { status: 200 },
    )
  } catch (error: unknown) {
    logger.error('Error while trying to get aptitud médica.')
    logger.error((error as Error).message)

    return NextResponse.json(
      {
        status: false,
        message: 'Error while trying to get aptitud médica.',
      },
      { status: 500 },
    )
  }
}

export async function handleSabanaInterconsultations(
  request: NextRequest,
): Promise<NextResponse> {
  const auth = authenticateRequest(request)

  if (!auth.ok) {
    return auth.response
  }

  try {
    const query = getQueryObject(request) as unknown as SabanaQueryDTO
    const ruc = String(auth.user.ruc ?? '')

    logger.info(`Getting interconsultations: ${JSON.stringify(query)} | ${ruc}`)

    const interconsultations = await sabanaService.findInterconsultations(
      query,
      ruc,
    )

    return NextResponse.json(
      {
        status: true,
        data: {
          interconsultations,
        },
      },
      { status: 200 },
    )
  } catch (error: unknown) {
    logger.error((error as Error).message)

    return NextResponse.json(
      {
        status: false,
        message: 'Error while trying to get interconsultations.',
      },
      { status: 500 },
    )
  }
}
