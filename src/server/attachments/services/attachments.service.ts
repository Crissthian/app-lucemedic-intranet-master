import { Client } from 'basic-ftp'
import AdmZip from 'adm-zip'
import { Writable } from 'stream'
import { GetDownloadsDTO } from '../../commons/dto/get-downloads.dto'
import { logger } from '../../shared'

enum AttachmentType {
  CERTIFICADO = 0,
  EMO = 1
}

export default class AttachmentsService {
  private readonly FTP_HOST: string = process.env.FTP_HOST || ''
  private readonly FTP_USER: string = process.env.FTP_USER || ''
  private readonly FTP_PASSWORD: string = process.env.FTP_PASSWORD || ''

  async downloadAttachment(payload: GetDownloadsDTO): Promise<Buffer> {
    const client = new Client()

    try {
      logger.info(
        `Downloading ${payload.ids.length} total attachments from FTP server.`
      )

      if (payload.ids.length === 0) {
        throw new Error('No attachments to download from FTP server.')
      }

      if (payload.ids.length > 20) {
        throw new Error('Cannot download more than 20 attachments at once.')
      }

      client.ftp.verbose = false

      await client.access({
        host: this.FTP_HOST,
        user: this.FTP_USER,
        password: this.FTP_PASSWORD,
        secure: false
      })

      const zip = new AdmZip()

      for (const id of payload.ids) {
        const file = `${id}.pdf`
        let remotePath = './'
        let entryName = ''

        if (payload.type === AttachmentType.CERTIFICADO) {
          remotePath += `CERTIFICADO/${file}`
          entryName = `certificado_${file}`
        }

        if (payload.type === AttachmentType.EMO) {
          remotePath += `EMO/${file}`
          entryName = `emo_${file}`
        }

        logger.info(
          `AttachmentsService.downloadAttachment | init | ${remotePath}`
        )

        // Download directly to memory
        const chunks: Buffer[] = []
        const writableStream = new Writable({
          write(chunk, _encoding, callback) {
            chunks.push(Buffer.from(chunk))
            callback()
          }
        })

        await client.downloadTo(writableStream, remotePath)
        const fileBuffer = Buffer.concat(chunks)

        logger.info('AttachmentsService.downloadAttachment | end download')

        logger.info(
          `Downloaded ${file} from FTP server (${fileBuffer.length} bytes).`
        )

        // Add buffer directly to zip
        zip.addFile(entryName, fileBuffer)
      }

      client.close()

      logger.info('All attachments downloaded successfully.')

      return zip.toBuffer()
    } catch (error: unknown) {
      console.error(error)
      throw new Error(`${(error as Error).message}`)
    } finally {
      client.close()
    }
  }
}
