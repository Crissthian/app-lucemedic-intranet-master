import { NextRequest, NextResponse } from 'next/server'
import { MedicalExamsQueryDTO } from '@/src/server/medical-exams/dto/medical-exams-query.dto'
import { UserToken } from '@/src/server/medical-exams/dto/user-token.dto'
import MedicalExamsService from '@/src/server/medical-exams/services/medical-exams.service'
import { authenticateRequest } from '@/src/server/http/auth'
import { logger } from '@/src/server/shared'

const medicalExamsService = new MedicalExamsService()

async function parseJsonBody(request: NextRequest): Promise<Record<string, unknown>> {
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

function getAuthUser(request: NextRequest): { response?: NextResponse; user?: UserToken } {
  const auth = authenticateRequest(request)

  if (!auth.ok) {
    return { response: auth.response }
  }

  return { user: auth.user as unknown as UserToken }
}

export async function handleMedicalExamsQuery(
  request: NextRequest,
): Promise<NextResponse> {
  const { response } = getAuthUser(request)
  if (response) {
    return response
  }

  const body = await parseJsonBody(request)
  const query = String(body.query ?? '')

  try {
    logger.info(`Executing query: ${query}`)

    const data = await medicalExamsService.executeQuery(query)

    return NextResponse.json(
      {
        status: true,
        data,
      },
      { status: 200 },
    )
  } catch (error: unknown) {
    logger.error(`Error while trying to execute query: ${query}`)
    logger.error((error as Error).message)

    return NextResponse.json(
      {
        status: false,
        message: 'Error while trying to verify user',
      },
      { status: 500 },
    )
  }
}

export async function handleFindMedicalExams(
  request: NextRequest,
): Promise<NextResponse> {
  const auth = getAuthUser(request)
  if (auth.response || !auth.user) {
    return auth.response as NextResponse
  }

  const query = getQueryObject(request) as unknown as MedicalExamsQueryDTO

  try {
    logger.info(`Executing get medical exams: ${JSON.stringify(query)}`)

    const data = await medicalExamsService.find(query, auth.user)

    return NextResponse.json(
      {
        status: true,
        data,
      },
      { status: 200 },
    )
  } catch (error: unknown) {
    logger.error(`Error while trying medical exams ${JSON.stringify(query)}`)
    logger.error((error as Error).message)

    return NextResponse.json(
      {
        status: false,
        message: 'Error while trying medical exams.',
      },
      { status: 500 },
    )
  }
}

export async function handleFindMedicalExam(
  request: NextRequest,
  uid: string | undefined,
): Promise<NextResponse> {
  const { response } = getAuthUser(request)
  if (response) {
    return response
  }

  if (!uid) {
    return NextResponse.json(
      { status: false, message: 'Missing medical exam id.' },
      { status: 400 },
    )
  }

  try {
    logger.info(`Executing get medical exam: ${uid}`)

    const data = await medicalExamsService.findOne(uid)

    return NextResponse.json(
      {
        status: true,
        data,
      },
      { status: 200 },
    )
  } catch (error: unknown) {
    logger.error(`Error while trying medical exam details: ${uid}`)
    logger.error((error as Error).message)

    return NextResponse.json(
      {
        status: false,
        message: 'Error while trying medical exams.',
      },
      { status: 500 },
    )
  }
}

export async function handleDownloadEMO(
  request: NextRequest,
  uid: string | undefined,
): Promise<NextResponse> {
  const auth = getAuthUser(request)
  if (auth.response || !auth.user) {
    return auth.response as NextResponse
  }

  if (!uid) {
    return NextResponse.json(
      { status: false, message: 'Missing medical exam id.' },
      { status: 400 },
    )
  }

  try {
    logger.info(`Executing download EMO: ${uid}`)

    const file = await medicalExamsService.downloadEMO(auth.user, uid)

    return NextResponse.json(
      {
        status: true,
        data: {
          file,
        },
      },
      { status: 200 },
    )
  } catch (error: unknown) {
    logger.error(`Error while trying download EMO: ${uid}`)
    logger.error((error as Error).message)

    return NextResponse.json(
      {
        status: false,
        message: 'Error while trying download EMO.',
      },
      { status: 500 },
    )
  }
}

export async function handleDownloadCertificado(
  request: NextRequest,
  uid: string | undefined,
): Promise<NextResponse> {
  const auth = getAuthUser(request)
  if (auth.response || !auth.user) {
    return auth.response as NextResponse
  }

  if (!uid) {
    return NextResponse.json(
      { status: false, message: 'Missing medical exam id.' },
      { status: 400 },
    )
  }

  try {
    logger.info(`Executing download certificado: ${uid}`)

    const file = await medicalExamsService.downloadCertificado(auth.user, uid)

    return NextResponse.json(
      {
        status: true,
        data: {
          file,
        },
      },
      { status: 200 },
    )
  } catch (error: unknown) {
    logger.error(`Error while trying download certificado: ${uid}`)
    logger.error((error as Error).message)

    return NextResponse.json(
      {
        status: false,
        message: 'Error while trying download certificado.',
      },
      { status: 500 },
    )
  }
}

export async function handleFindDiagnosis(
  request: NextRequest,
  uid: string | undefined,
): Promise<NextResponse> {
  const { response } = getAuthUser(request)
  if (response) {
    return response
  }

  if (!uid) {
    return NextResponse.json(
      { status: false, message: 'Missing medical exam id.' },
      { status: 400 },
    )
  }

  try {
    const diagnosis = await medicalExamsService.findDiagnosis(uid)

    return NextResponse.json(
      {
        status: true,
        data: {
          diagnosis,
        },
      },
      { status: 200 },
    )
  } catch (error: unknown) {
    logger.error((error as Error).message)

    return NextResponse.json(
      {
        status: false,
        message: 'Error while trying find diagnosis.',
      },
      { status: 500 },
    )
  }
}

export async function handleDownloadDiagnosis(
  request: NextRequest,
  uid: string | undefined,
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
      { status: 400 },
    )
  }

  try {
    logger.info(`Executing download diagnosis: ${JSON.stringify(body)}`)
    logger.info(`User ${auth.user.sub} is downloading diagnosis ${uid}`)

    const file = await medicalExamsService.downloadDiagnosis(uid, diagnosisType)

    return NextResponse.json(
      {
        status: true,
        data: {
          file,
        },
      },
      { status: 200 },
    )
  } catch (error: unknown) {
    logger.error(`Error while trying download diagnosis: ${JSON.stringify(body)}`)
    logger.error((error as Error).message)

    return NextResponse.json(
      {
        status: false,
        message: 'Error while trying download diagnosis.',
      },
      { status: 500 },
    )
  }
}

export async function handleDownloadDiagnosisXray(
  request: NextRequest,
  uid: string | undefined,
): Promise<NextResponse> {
  const { response } = getAuthUser(request)
  if (response) {
    return response
  }

  if (!uid) {
    return NextResponse.json(
      { status: false, message: 'Missing medical exam id.' },
      { status: 400 },
    )
  }

  try {
    logger.info(`Executing download diagnosis xray: ${uid}`)

    const file = await medicalExamsService.downloadDiagnosisXray(uid)

    return NextResponse.json(
      {
        status: true,
        data: {
          file,
        },
      },
      { status: 200 },
    )
  } catch (error: unknown) {
    logger.error((error as Error).message)

    return NextResponse.json(
      {
        status: false,
        message: 'Error while trying download diagnosis xray.',
      },
      { status: 500 },
    )
  }
}

export async function handleFindConsultations(
  request: NextRequest,
  uid: string | undefined,
): Promise<NextResponse> {
  const { response } = getAuthUser(request)
  if (response) {
    return response
  }

  if (!uid) {
    return NextResponse.json(
      { status: false, message: 'Missing medical exam id.' },
      { status: 400 },
    )
  }

  try {
    const consultations = await medicalExamsService.findConsultations(uid)

    return NextResponse.json(
      {
        status: true,
        data: {
          consultations,
        },
      },
      { status: 200 },
    )
  } catch (error: unknown) {
    logger.error((error as Error).message)

    return NextResponse.json(
      {
        status: false,
        message: 'Error while trying find consultations.',
      },
      { status: 500 },
    )
  }
}

export async function handleDownloadConsultation(
  request: NextRequest,
  uid: string | undefined,
  fileId: string | undefined,
): Promise<NextResponse> {
  const { response } = getAuthUser(request)
  if (response) {
    return response
  }

  if (!uid || !fileId) {
    return NextResponse.json(
      { status: false, message: 'Missing consultation params.' },
      { status: 400 },
    )
  }

  try {
    logger.info(`Executing download consultation: ${uid} - ${fileId}`)

    const file = await medicalExamsService.downloadConsultation(fileId)

    return NextResponse.json(
      {
        status: true,
        data: {
          file,
        },
      },
      { status: 200 },
    )
  } catch (error: unknown) {
    logger.error((error as Error).message)

    return NextResponse.json(
      {
        status: false,
        message: 'Error while trying download consultation.',
      },
      { status: 500 },
    )
  }
}

export async function handleFindRecommendations(
  request: NextRequest,
  uid: string | undefined,
): Promise<NextResponse> {
  const { response } = getAuthUser(request)
  if (response) {
    return response
  }

  if (!uid) {
    return NextResponse.json(
      { status: false, message: 'Missing medical exam id.' },
      { status: 400 },
    )
  }

  try {
    const recommendations = await medicalExamsService.findRecommendations(uid)

    return NextResponse.json(
      {
        status: true,
        data: {
          recommendations,
        },
      },
      { status: 200 },
    )
  } catch (error: unknown) {
    logger.error((error as Error).message)

    return NextResponse.json(
      {
        status: false,
        message: 'Error while trying find recommendations.',
      },
      { status: 500 },
    )
  }
}

export async function handleDownloadRecommendation(
  request: NextRequest,
  uid: string | undefined,
  fileId: string | undefined,
): Promise<NextResponse> {
  const { response } = getAuthUser(request)
  if (response) {
    return response
  }

  if (!uid || !fileId) {
    return NextResponse.json(
      { status: false, message: 'Missing recommendation params.' },
      { status: 400 },
    )
  }

  try {
    logger.info(`Executing download recommendation: ${uid} - ${fileId}`)

    const file = await medicalExamsService.downloadRecommendation(fileId)

    return NextResponse.json(
      {
        status: true,
        data: {
          file,
        },
      },
      { status: 200 },
    )
  } catch (error: unknown) {
    logger.error((error as Error).message)

    return NextResponse.json(
      {
        status: false,
        message: 'Error while trying download recommendation.',
      },
      { status: 500 },
    )
  }
}
