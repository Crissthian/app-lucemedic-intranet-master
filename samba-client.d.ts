declare module 'samba-client' {
  type SambaClientOptions = {
    address: string
    domain?: string
    username?: string
    password?: string
  }

  export default class SambaClient {
    constructor(options: SambaClientOptions)
    getFile(remotePath: string, localPath: string): Promise<unknown>
    sendFile(localPath: string, remotePath: string): Promise<unknown>
  }
}
