export const DB_HOST = process.env.DB_HOST || ''
export const DB_USER = process.env.DB_USER || ''
export const DB_PASS = process.env.DB_PASS || ''
export const DB_NAME = process.env.DB_NAME || ''
export const DB_INSTANCE = process.env.DB_INSTANCE

const jwtSecret = process.env.JWT_SECRET || 'change-me-in-dev'

if (process.env.NODE_ENV === 'production' && jwtSecret === 'change-me-in-dev') {
	throw new Error('JWT_SECRET is required in production environment')
}

export const JWT_SECRET = jwtSecret

export const FTP_HOST = process.env.FTP_HOST || ''
export const FTP_USER = process.env.FTP_USER || ''
export const FTP_PASSWORD = process.env.FTP_PASSWORD || ''
