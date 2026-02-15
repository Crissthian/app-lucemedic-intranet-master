import { NextRequest, NextResponse } from 'next/server'
import HistoricalService from '@/src/server/medical-exams/services/historical.service'
import { authenticateRequest } from '@/src/server/http/auth'
import { logger } from '@/src/server/shared'

const historicalService = new HistoricalService()

function ensureAuth(request: NextRequest): NextResponse | null {
  const auth = authenticateRequest(request)

  if (!auth.ok) {
    return auth.response
  }

  return null
}

export async function handleHistoricalRadiology(
  request: NextRequest,
  dni: string | undefined
): Promise<NextResponse> {
  const authResponse = ensureAuth(request)
  if (authResponse) {
    return authResponse
  }

  if (!dni) {
    return NextResponse.json(
      { status: false, message: 'Missing dni.' },
      { status: 400 }
    )
  }

  try {
    logger.info(
      `Executing get radiology images of user: ${JSON.stringify(dni)}`
    )

    const { localFiles: files, radiologies } =
      await historicalService.downloadRadiologyImages(dni)

    logger.info(`Files downloaded: ${files.length}`)

    return NextResponse.json(
      {
        status: true,
        data: {
          radiologies,
          files
        }
      },
      { status: 200 }
    )
  } catch (error: unknown) {
    logger.error((error as Error).message)

    return NextResponse.json(
      {
        status: false,
        message: 'Error while trying to get radiology images'
      },
      { status: 500 }
    )
  }
}

export async function handleHistoricalAudiometry(
  request: NextRequest,
  dni: string | undefined
): Promise<NextResponse> {
  const authResponse = ensureAuth(request)
  if (authResponse) {
    return authResponse
  }

  if (!dni) {
    return NextResponse.json(
      { status: false, message: 'Missing dni.' },
      { status: 400 }
    )
  }

  try {
    logger.info(`Executing get radiology images of user: ${dni}`)

    const { localFiles: files, audiometries } =
      await historicalService.downloadAudiometryImages(dni)

    logger.info(`Files downloaded: ${files.length}`)

    return NextResponse.json(
      {
        status: true,
        data: {
          audiometries,
          files
        }
      },
      { status: 200 }
    )
  } catch (error: unknown) {
    logger.error((error as Error).message)

    return NextResponse.json(
      {
        status: false,
        message: 'Error while trying to get audiometry images'
      },
      { status: 500 }
    )
  }
}

export async function handleHistoricalCardiology(
  request: NextRequest,
  dni: string | undefined
): Promise<NextResponse> {
  const authResponse = ensureAuth(request)
  if (authResponse) {
    return authResponse
  }

  if (!dni) {
    return NextResponse.json(
      { status: false, message: 'Missing dni.' },
      { status: 400 }
    )
  }

  try {
    logger.info(`Executing get cardiology report of user: ${dni}`)
    const cardiology_reports = await historicalService.getCardiologyReport(dni)

    return NextResponse.json(
      {
        status: true,
        data: {
          cardiology_reports
        }
      },
      { status: 200 }
    )
  } catch (error: unknown) {
    logger.error(`Error while trying to get cardiology report for user: ${dni}`)

    return NextResponse.json(
      {
        status: false,
        message: 'Error while trying to get cardiology report'
      },
      { status: 500 }
    )
  }
}

export async function handleHistoricalImc(
  request: NextRequest,
  dni: string | undefined
): Promise<NextResponse> {
  const authResponse = ensureAuth(request)
  if (authResponse) {
    return authResponse
  }

  if (!dni) {
    return NextResponse.json(
      { status: false, message: 'Missing dni.' },
      { status: 400 }
    )
  }

  try {
    logger.info(`Executing get IMC report of user: ${dni}`)
    const imc_reports = await historicalService.getIMCReport(dni)

    return NextResponse.json(
      {
        status: true,
        data: {
          imc_reports
        }
      },
      { status: 200 }
    )
  } catch (error: unknown) {
    logger.error(`Error while trying to get IMC report for user: ${dni}`)

    return NextResponse.json(
      {
        status: false,
        message: 'Error while trying to get cardiology report'
      },
      { status: 500 }
    )
  }
}

export async function handleHistoricalLaboratoryExams(
  request: NextRequest,
  dni: string | undefined
): Promise<NextResponse> {
  const authResponse = ensureAuth(request)
  if (authResponse) {
    return authResponse
  }

  if (!dni) {
    return NextResponse.json(
      { status: false, message: 'Missing dni.' },
      { status: 400 }
    )
  }

  try {
    logger.info(`Executing get Laboratory Exams report of user: ${dni}`)
    const laboratory_exams_reports =
      await historicalService.getLaboratyExamsReport(dni)

    return NextResponse.json(
      {
        status: true,
        data: {
          laboratory_exams_reports
        }
      },
      { status: 200 }
    )
  } catch (error: unknown) {
    logger.error(
      `Error while trying to get laboratory exams report for user: ${dni}`
    )

    return NextResponse.json(
      {
        status: false,
        message: 'Error while trying to get cardiology report'
      },
      { status: 500 }
    )
  }
}
