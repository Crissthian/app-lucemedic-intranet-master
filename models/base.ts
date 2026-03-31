export interface BaseApi<T = any> {
  readonly error?: string
  readonly message?: string
  readonly status: boolean
  readonly data: T
}
