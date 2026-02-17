export interface BaseApi<T = any> {
  readonly error?: string
  readonly status: boolean
  readonly data: T
}
