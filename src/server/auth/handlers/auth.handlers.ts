import crypto from 'crypto'
import path from 'path'
import { mkdir, writeFile } from 'fs/promises'
import { NextRequest, NextResponse } from 'next/server'
import AuthService from '@/src/server/auth/services/auth.service'
import { UserUpdateDTO } from '@/src/server/auth/dto/user-update.dto'
import { authenticateRequest } from '@/src/server/http/auth'
import { logger } from '@/src/server/shared'

const authService = new AuthService()
const TEMP_DIR = path.join(process.cwd(), 'temp')

async function parseJsonBody(
  request: NextRequest
): Promise<Record<string, unknown>> {
  try {
    return (await request.json()) as Record<string, unknown>
  } catch {
    return {}
  }
}

async function getUploadData(
  request: NextRequest
): Promise<{ originalFilename: string; localFilePath: string } | null> {
  const formData = await request.formData()
  const file = formData.get('file')

  if (!(file instanceof File)) {
    return null
  }

  await mkdir(TEMP_DIR, { recursive: true })

  const originalFilename = file.name || `${crypto.randomUUID()}.bin`
  const extension = path.extname(originalFilename)
  const tempFileName = `${crypto.randomUUID()}${extension}`
  const fullFilePath = path.join(TEMP_DIR, tempFileName)
  const bytes = Buffer.from(await file.arrayBuffer())

  await writeFile(fullFilePath, bytes)

  return {
    originalFilename,
    localFilePath: fullFilePath.replace(/\\/g, '/')
  }
}

export async function handleLogin(request: NextRequest): Promise<NextResponse> {
  const body = await parseJsonBody(request)
  const username = String(body.username ?? '')
  const password = String(body.password ?? '')

  try {
    logger.info(`Login attempt for user ${username}`)

    const data = await authService.login(username, password)

    return NextResponse.json(
      {
        status: true,
        data
      },
      { status: 200 }
    )
  } catch (error: unknown) {
    logger.error(`Error while trying to login user ${username}`)
    logger.error((error as Error).message)

    return NextResponse.json(
      {
        status: false,
        message: 'Error while trying to login user'
      },
      { status: 500 }
    )
  }
}

export async function handleVerify(
  request: NextRequest
): Promise<NextResponse> {
  const body = await parseJsonBody(request)
  const accessToken = String(body.accessToken ?? '')
  const username = String(body.username ?? '')

  try {
    logger.info(`Verify attempt for user ${username}`)

    const data = await authService.verify(accessToken)

    return NextResponse.json(
      {
        status: true,
        data
      },
      { status: 200 }
    )
  } catch (error: unknown) {
    logger.error(`Error while trying to verify user ${username}`)
    logger.error((error as Error).message)

    return NextResponse.json(
      {
        status: false,
        message: 'Error while trying to verify user'
      },
      { status: 500 }
    )
  }
}

export async function handleProfile(
  request: NextRequest
): Promise<NextResponse> {
  const auth = authenticateRequest(request)

  if (!auth.ok) {
    return auth.response
  }

  try {
    const user = await authService.getProfile(auth.user.sub)

    return NextResponse.json(
      {
        status: true,
        data: user
      },
      { status: 200 }
    )
  } catch (error: unknown) {
    logger.error(`Error while trying to get profile: ${String(auth.user.sub)}`)
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

export async function handleUpdateUser(
  request: NextRequest
): Promise<NextResponse> {
  const auth = authenticateRequest(request)

  if (!auth.ok) {
    return auth.response
  }

  const payload = (await parseJsonBody(request)) as unknown as UserUpdateDTO

  try {
    logger.info(`Update user ${auth.user.sub}`)

    await authService.update(auth.user.sub, payload)

    return NextResponse.json(
      {
        status: true,
        data: {}
      },
      { status: 200 }
    )
  } catch (error: unknown) {
    logger.error(`Error while trying to update user ${auth.user.sub}`)
    logger.error((error as Error).message)

    return NextResponse.json(
      {
        status: false,
        message: 'Error while trying to update user'
      },
      { status: 500 }
    )
  }
}

export async function handleUpdateProfilePhoto(
  request: NextRequest
): Promise<NextResponse> {
  const auth = authenticateRequest(request)

  if (!auth.ok) {
    return auth.response
  }

  try {
    const upload = await getUploadData(request)

    if (!upload) {
      return NextResponse.json(
        {
          status: false,
          message: 'No file found'
        },
        { status: 400 }
      )
    }

    await authService.updatePhoto(
      String(auth.user.sub ?? ''),
      upload.originalFilename,
      upload.localFilePath
    )

    return NextResponse.json(
      {
        status: true,
        data: {}
      },
      { status: 200 }
    )
  } catch (error: unknown) {
    logger.error(
      `Error while trying to update profile photo: ${String(auth.user.sub)}`
    )
    logger.error((error as Error).message)

    return NextResponse.json(
      {
        status: false,
        message: 'Error while trying to update profile photo.'
      },
      { status: 500 }
    )
  }
}
