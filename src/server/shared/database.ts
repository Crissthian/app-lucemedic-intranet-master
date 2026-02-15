import { config, connect, ConnectionPool } from 'mssql'

export interface QueryResult<T> {
  success: boolean;
  data: T[];
}

declare global {
  // Keep the SQL pool alive across hot reloads in development.
  // eslint-disable-next-line no-var
  var __lucemedicDbPool: ConnectionPool | undefined
}

export class Database {
  private config: config
  private poolPromise: Promise<ConnectionPool> | null

  constructor(config: config) {
    this.config = config
    this.poolPromise = null
  }

  private getPool(): Promise<ConnectionPool> {
    if (global.__lucemedicDbPool?.connected) {
      return Promise.resolve(global.__lucemedicDbPool)
    }

    if (!this.poolPromise) {
      this.poolPromise = connect(this.config).then((pool) => {
        global.__lucemedicDbPool = pool
        return pool
      })
    }

    return this.poolPromise
  }

  public async query<T>(query: string): Promise<QueryResult<T>> {
    try {
      const result: QueryResult<T> = {
        success: false,
        data: [],
      }
      const pool = await this.getPool()

      const data = await pool.request().query(query)

      if (data.recordset && data.recordset.length === 0) return result

      result.success = true
      result.data = data.recordset as T[]

      return result
    } catch (error: unknown) {
      throw new Error((error as Error).message)
    }
  }
}

