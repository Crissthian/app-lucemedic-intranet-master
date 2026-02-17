import jwt from 'jsonwebtoken'
import { NextRequest, NextResponse } from 'next/server'
import { JWT_SECRET, logger } from '@/src/server/shared'

export type AuthenticatedUser = Record<string, unknown> & {
  sub: string
}

export type AuthResult =
  | { ok: true; user: AuthenticatedUser }
  | { ok: false; response: NextResponse }

export function authenticateRequest(request: NextRequest): AuthResult {
  const authorization = request.headers.get('authorization')

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return {
      ok: false,
      response: NextResponse.json(
        { error: 'Acceso no autorizado' },
        { status: 401 }
      )
    }
  }

  try {
    const token = authorization.slice('Bearer '.length)
    const decoded = jwt.verify(token, JWT_SECRET)

    if (typeof decoded === 'string') {
      throw new Error('Acceso no autorizado')
    }

    const user = decoded as AuthenticatedUser

    logger.info('Token decoded successfully')

    return {
      ok: true,
      user
    }
  } catch {
    return {
      ok: false,
      response: NextResponse.json(
        { error: 'Acceso no autorizado' },
        { status: 401 }
      )
    }
  }
}
