import jwt, { SignOptions, Secret } from 'jsonwebtoken'

interface JWTOptions {
  secret: Secret
  expiresIn?: SignOptions['expiresIn']
}

export default class JWT {
  private readonly secret: Secret
  private readonly expiresIn: SignOptions['expiresIn']

  constructor(options: JWTOptions) {
    this.secret = options.secret
    this.expiresIn = options.expiresIn || '1h'
  }

  public sign(payload: Record<string, unknown>): string {
    try {
      const token = jwt.sign(payload, this.secret, {
        expiresIn: this.expiresIn
      })

      return token
    } catch {
      throw new Error('Error signing JWT')
    }
  }

  public verify(token: string): Record<string, unknown> {
    try {
      const decoded = jwt.verify(token, this.secret)

      if (typeof decoded === 'string') {
        throw new Error('Error verifying JWT')
      }

      return decoded as Record<string, unknown>
    } catch {
      throw new Error('Error verifying JWT')
    }
  }
}
