import { NextRequest, NextResponse } from 'next/server'
import AuthService from '@/src/server/auth/services/auth.service'
import { UserUpdateDTO } from '@/src/server/auth/dto/user-update.dto'
import { authenticateRequest } from '@/src/server/http/auth'
import { logger } from '@/src/server/shared'

const authService = new AuthService()

type LoginAttemptState = {
  attempts: number
  firstAttemptAt: number
  blockedUntil: number
}

const loginAttempts = new Map<string, LoginAttemptState>()
const LOGIN_WINDOW_MS = 10 * 60 * 1000
const LOGIN_MAX_ATTEMPTS = 5
const LOGIN_BLOCK_MS = 15 * 60 * 1000

function getClientIp(request: NextRequest): string {
  const forwardedFor = request.headers.get('x-forwarded-for')

  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim()
  }

  return request.headers.get('x-real-ip') || 'unknown'
}

function getRateLimitKey(request: NextRequest, username: string): string {
  return `${getClientIp(request)}:${username || 'unknown'}`
}

function getOrCreateAttemptState(key: string, now: number): LoginAttemptState {
  const current = loginAttempts.get(key)

  if (!current) {
    const state: LoginAttemptState = {
      attempts: 0,
      firstAttemptAt: now,
      blockedUntil: 0
    }
    loginAttempts.set(key, state)
    return state
  }

  if (now - current.firstAttemptAt > LOGIN_WINDOW_MS) {
    current.attempts = 0
    current.firstAttemptAt = now
  }

  return current
}

function isBlocked(state: LoginAttemptState, now: number): boolean {
  return state.blockedUntil > now
}

function registerFailedAttempt(state: LoginAttemptState, now: number): void {
  state.attempts += 1

  if (state.attempts >= LOGIN_MAX_ATTEMPTS) {
    state.blockedUntil = now + LOGIN_BLOCK_MS
    state.attempts = 0
    state.firstAttemptAt = now
  }
}

function clearAttempts(key: string): void {
  loginAttempts.delete(key)
}

async function parseJsonBody(
  request: NextRequest
): Promise<Record<string, unknown>> {
  try {
    return (await request.json()) as Record<string, unknown>
  } catch {
    return {}
  }
}

export async function handleLogin(request: NextRequest): Promise<NextResponse> {
  const body = await parseJsonBody(request)
  const username = String(body.username ?? '').trim()
  const password = String(body.password ?? '')

  if (!username || !password) {
    return NextResponse.json(
      {
        status: false,
        message: 'Debe ingresar usuario y contraseña.'
      },
      { status: 400 }
    )
  }

  const now = Date.now()
  const rateLimitKey = getRateLimitKey(request, username)
  const state = getOrCreateAttemptState(rateLimitKey, now)

  if (isBlocked(state, now)) {
    const secondsLeft = Math.ceil((state.blockedUntil - now) / 1000)

    return NextResponse.json(
      {
        status: false,
        message: `Demasiados intentos fallidos. Intente de nuevo en ${secondsLeft} segundos.`
      },
      { status: 429 }
    )
  }

  try {
    logger.info(`Login attempt for user ${username}`)

    const data = await authService.login(username, password)

    clearAttempts(rateLimitKey)

    return NextResponse.json(
      {
        status: true,
        data
      },
      { status: 200 }
    )
  } catch (error: unknown) {
    const message = (error as Error).message

    if (message === 'Invalid credentials') {
      registerFailedAttempt(state, now)

      return NextResponse.json(
        {
          status: false,
          message: 'Credenciales inválidas'
        },
        { status: 401 }
      )
    }

    if (message === 'Account disabled') {
      return NextResponse.json(
        {
          status: false,
          message:
            'Su usuario se encuentra bloqueado por falta de pago.\n' +
            'Por favor, regularice su situación para restablecer el acceso.\n' +
            'Para cualquier duda, comuníquese al 980773060'
        },
        { status: 401 }
      )
    }

    logger.error(`Error while trying to login user ${username}`)
    logger.error(message)

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
    const formData = await request.formData()
    const file = formData.get('file')

    if (!(file instanceof File)) {
      return NextResponse.json(
        {
          status: false,
          message: 'No file found'
        },
        { status: 400 }
      )
    }

    const originalFilename = file.name || `photo_${Date.now()}.bin`
    const buffer = Buffer.from(await file.arrayBuffer())

    await authService.updatePhoto(
      String(auth.user.sub ?? ''),
      originalFilename,
      buffer
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
