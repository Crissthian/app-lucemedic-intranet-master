import { NextRequest, NextResponse } from 'next/server'
import { MedicalExamsQueryDTO } from '@/src/server/medical-exams/dto/medical-exams-query.dto'
import { UserToken } from '@/src/server/medical-exams/dto/user-token.dto'
import MedicalExamsService from '@/src/server/medical-exams/services/medical-exams.service'
import { authenticateRequest } from '@/src/server/http/auth'
import { logger } from '@/src/server/shared'
import { ROLES_TYPES } from '@/shared/constants'

const medicalExamsService = new MedicalExamsService()

async function parseJsonBody(
  request: NextRequest
): Promise<Record<string, unknown>> {
  try {
    return (await request.json()) as Record<string, unknown>
  } catch {
    return {}
  }
}

function getQueryObject(request: NextRequest): Record<string, string> {
  const result: Record<string, string> = {}

  request.nextUrl.searchParams.forEach((value, key) => {
    result[key] = value
  })

  return result
}

function getAuthUser(request: NextRequest): {
  response?: NextResponse
  user?: UserToken
} {
  const auth = authenticateRequest(request)

  if (!auth.ok) {
    return { response: auth.response }
  }

  return { user: auth.user as unknown as UserToken }
}

export async function handleMedicalExamsQuery(
  request: NextRequest
): Promise<NextResponse> {
  void request

  return NextResponse.json(
    {
      status: false,
      message: 'Endpoint disabled for security reasons.'
    },
    { status: 403 }
  )
}

export async function handleFindMedicalExams(
  request: NextRequest
): Promise<NextResponse> {
  const auth = getAuthUser(request)
  if (auth.response || !auth.user) {
    return auth.response as NextResponse
  }

  const query = getQueryObject(request) as unknown as MedicalExamsQueryDTO

  try {
    logger.info('Executing get medical exams')

    const data = await medicalExamsService.find(query, auth.user)

    return NextResponse.json(
      {
        status: true,
        data
      },
      { status: 200 }
    )
  } catch (error: unknown) {
    logger.error('Error while trying medical exams')
    logger.error((error as Error).message)

    return NextResponse.json(
      {
        status: false,
        message: 'Error while trying medical exams.'
      },
      { status: 500 }
    )
  }
}

export async function handleFindMedicalExam(
  request: NextRequest,
  uid: string | undefined
): Promise<NextResponse> {
  const { response } = getAuthUser(request)
  if (response) {
    return response
  }

  if (!uid) {
    return NextResponse.json(
      { status: false, message: 'Missing medical exam id.' },
      { status: 400 }
    )
  }

  try {
    logger.info('Executing get medical exam')

    const data = await medicalExamsService.findOne(uid)

    return NextResponse.json(
      {
        status: true,
        data
      },
      { status: 200 }
    )
  } catch (error: unknown) {
    logger.error('Error while trying medical exam details')
    logger.error((error as Error).message)

    return NextResponse.json(
      {
        status: false,
        message: 'Error while trying medical exams.'
      },
      { status: 500 }
    )
  }
}

export async function handleDownloadEMO(
  request: NextRequest,
  uid: string | undefined
): Promise<NextResponse> {
  const auth = getAuthUser(request)
  if (auth.response || !auth.user) {
    return auth.response as NextResponse
  }

  if (!uid) {
    return NextResponse.json(
      { status: false, message: 'Missing medical exam id.' },
      { status: 400 }
    )
  }

  try {
    logger.info('Executing download EMO')

    const fileBuffer = await medicalExamsService.downloadEMO(auth.user, uid)

    return NextResponse.json(
      {
        status: true,
        data: {
          file: fileBuffer.toString('base64')
        }
      },
      { status: 200 }
    )
  } catch (error: unknown) {
    logger.error('Error while trying download EMO')
    logger.error((error as Error).message)

    return NextResponse.json(
      {
        status: false,
        message: 'Error while trying download EMO.'
      },
      { status: 500 }
    )
  }
}

export async function handleDownloadCertificado(
  request: NextRequest,
  uid: string | undefined
): Promise<NextResponse> {
  const auth = getAuthUser(request)
  if (auth.response || !auth.user) {
    return auth.response as NextResponse
  }

  if (!uid) {
    return NextResponse.json(
      { status: false, message: 'Missing medical exam id.' },
      { status: 400 }
    )
  }

  try {
    logger.info('Executing download certificado')

    const fileBuffer = await medicalExamsService.downloadCertificado(
      auth.user,
      uid
    )

    return NextResponse.json(
      {
        status: true,
        data: {
          file: fileBuffer.toString('base64')
        }
      },
      { status: 200 }
    )
  } catch (error: unknown) {
    logger.error('Error while trying download certificado')
    logger.error((error as Error).message)

    return NextResponse.json(
      {
        status: false,
        message: 'Error while trying download certificado.'
      },
      { status: 500 }
    )
  }
}

export async function handleDownloadCertificadoEtas(
  request: NextRequest,
  uid: string | undefined
): Promise<NextResponse> {
  const auth = getAuthUser(request)
  if (auth.response || !auth.user) {
    return auth.response as NextResponse
  }

  if (!uid) {
    return NextResponse.json(
      { status: false, message: 'Missing medical exam id.' },
      { status: 400 }
    )
  }

  try {
    logger.info('Executing download certificado ETAS')

    const fileBuffer = await medicalExamsService.downloadCertificadoEtas(
      auth.user,
      uid
    )

    return NextResponse.json(
      {
        status: true,
        data: {
          file: fileBuffer.toString('base64')
        }
      },
      { status: 200 }
    )
  } catch (error: unknown) {
    logger.error('Error while trying download certificado ETAS')
    logger.error((error as Error).message)

    return NextResponse.json(
      {
        status: false,
        message: 'El archivo de Certificado ETAS no existe.'
      },
      { status: 200 }
    )
  }
}

export async function handleFindDiagnosis(
  request: NextRequest,
  uid: string | undefined
): Promise<NextResponse> {
  const { response } = getAuthUser(request)
  if (response) {
    return response
  }

  if (!uid) {
    return NextResponse.json(
      { status: false, message: 'Missing medical exam id.' },
      { status: 400 }
    )
  }

  try {
    const diagnosis = await medicalExamsService.findDiagnosis(uid)

    return NextResponse.json(
      {
        status: true,
        data: {
          diagnosis
        }
      },
      { status: 200 }
    )
  } catch (error: unknown) {
    logger.error((error as Error).message)

    return NextResponse.json(
      {
        status: false,
        message: 'Error while trying find diagnosis.'
      },
      { status: 500 }
    )
  }
}

export async function handleDownloadDiagnosis(
  request: NextRequest,
  uid: string | undefined
): Promise<NextResponse> {
  const auth = getAuthUser(request)
  if (auth.response || !auth.user) {
    return auth.response as NextResponse
  }

  const body = await parseJsonBody(request)
  const diagnosisType = Number(body.diagnosisType)

  if (!uid || Number.isNaN(diagnosisType)) {
    return NextResponse.json(
      { status: false, message: 'Invalid diagnosis request.' },
      { status: 400 }
    )
  }

  // El informe de Lectura (17) solo lo puede descargar un médico
  if (diagnosisType === 17 && auth.user.profile !== ROLES_TYPES.DOCTOR) {
    return NextResponse.json(
      { status: false, message: 'Acceso no autorizado' },
      { status: 403 }
    )
  }

  try {
    logger.info('Executing download diagnosis')

    const fileBuffer = await medicalExamsService.downloadDiagnosis(
      uid,
      diagnosisType
    )

    return NextResponse.json(
      {
        status: true,
        data: {
          file: fileBuffer.toString('base64')
        }
      },
      { status: 200 }
    )
  } catch (error: unknown) {
    logger.error('Error while trying download diagnosis')
    logger.error((error as Error).message)

    return NextResponse.json(
      {
        status: false,
        message: 'Error while trying download diagnosis.'
      },
      { status: 500 }
    )
  }
}

export async function handleDownloadDiagnosisXray(
  request: NextRequest,
  uid: string | undefined
): Promise<NextResponse> {
  const { response } = getAuthUser(request)
  if (response) {
    return response
  }

  if (!uid) {
    return NextResponse.json(
      { status: false, message: 'Missing medical exam id.' },
      { status: 400 }
    )
  }

  try {
    logger.info('Executing download diagnosis xray')

    const fileBuffer = await medicalExamsService.downloadDiagnosisXray(uid)

    return NextResponse.json(
      {
        status: true,
        data: {
          file: fileBuffer.toString('base64')
        }
      },
      { status: 200 }
    )
  } catch (error: unknown) {
    logger.error((error as Error).message)

    return NextResponse.json(
      {
        status: false,
        message: 'Error while trying download diagnosis xray.'
      },
      { status: 500 }
    )
  }
}

export async function handleFindConsultations(
  request: NextRequest,
  uid: string | undefined
): Promise<NextResponse> {
  const { response } = getAuthUser(request)
  if (response) {
    return response
  }

  if (!uid) {
    return NextResponse.json(
      { status: false, message: 'Missing medical exam id.' },
      { status: 400 }
    )
  }

  try {
    const consultations = await medicalExamsService.findConsultations(uid)

    return NextResponse.json(
      {
        status: true,
        data: {
          consultations
        }
      },
      { status: 200 }
    )
  } catch (error: unknown) {
    logger.error((error as Error).message)

    return NextResponse.json(
      {
        status: false,
        message: 'Error while trying find consultations.'
      },
      { status: 500 }
    )
  }
}

export async function handleDownloadConsultation(
  request: NextRequest,
  uid: string | undefined,
  fileId: string | undefined
): Promise<NextResponse> {
  const { response } = getAuthUser(request)
  if (response) {
    return response
  }

  if (!uid || !fileId) {
    return NextResponse.json(
      { status: false, message: 'Missing consultation params.' },
      { status: 400 }
    )
  }

  try {
    logger.info('Executing download consultation')

    const fileBuffer = await medicalExamsService.downloadConsultation(fileId)

    return NextResponse.json(
      {
        status: true,
        data: {
          file: fileBuffer.toString('base64')
        }
      },
      { status: 200 }
    )
  } catch (error: unknown) {
    logger.error((error as Error).message)

    return NextResponse.json(
      {
        status: false,
        message: 'Error while trying download consultation.'
      },
      { status: 500 }
    )
  }
}

export async function handleFindRecommendations(
  request: NextRequest,
  uid: string | undefined
): Promise<NextResponse> {
  const { response } = getAuthUser(request)
  if (response) {
    return response
  }

  if (!uid) {
    return NextResponse.json(
      { status: false, message: 'Missing medical exam id.' },
      { status: 400 }
    )
  }

  try {
    const recommendations = await medicalExamsService.findRecommendations(uid)

    return NextResponse.json(
      {
        status: true,
        data: {
          recommendations
        }
      },
      { status: 200 }
    )
  } catch (error: unknown) {
    logger.error((error as Error).message)

    return NextResponse.json(
      {
        status: false,
        message: 'Error while trying find recommendations.'
      },
      { status: 500 }
    )
  }
}

export async function handleDownloadRecommendation(
  request: NextRequest,
  uid: string | undefined,
  fileId: string | undefined
): Promise<NextResponse> {
  const { response } = getAuthUser(request)
  if (response) {
    return response
  }

  if (!uid || !fileId) {
    return NextResponse.json(
      { status: false, message: 'Missing recommendation params.' },
      { status: 400 }
    )
  }

  try {
    logger.info('Executing download recommendation')

    const fileBuffer = await medicalExamsService.downloadRecommendation(fileId)

    return NextResponse.json(
      {
        status: true,
        data: {
          file: fileBuffer.toString('base64')
        }
      },
      { status: 200 }
    )
  } catch (error: unknown) {
    logger.error((error as Error).message)

    return NextResponse.json(
      {
        status: false,
        message: 'Error while trying download recommendation.'
      },
      { status: 500 }
    )
  }
}
