import { Client } from 'basic-ftp'
import AdmZip from 'adm-zip'
import { GetDownloadsDTO } from '../../commons/dto/get-downloads.dto'
import { logger } from '../../shared'

enum AttachmentType {
  CERTIFICADO = 0,
  EMO = 1
}

export default class AttachmentsService {
  private readonly client: Client
  private readonly FTP_HOST: string = process.env.FTP_HOST || ''
  private readonly FTP_USER: string = process.env.FTP_USER || ''
  private readonly FTP_PASSWORD: string = process.env.FTP_PASSWORD || ''

  constructor() {
    this.client = new Client()
  }

  async downloadAttachment(payload: GetDownloadsDTO): Promise<Buffer> {
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

      this.client.ftp.verbose = false

      await this.client.access({
        host: this.FTP_HOST,
        user: this.FTP_USER,
        password: this.FTP_PASSWORD,
        secure: false
      })

      const files: string[] = []

      for (const file of payload.ids) {
        files.push(`${file}.pdf`)
      }

      for (const file of files) {
        let remotePath = './'
        let localPath = './temp/'

        if (payload.type === AttachmentType.CERTIFICADO) {
          remotePath += `CERTIFICADO/${file}`
          localPath += `certificado_${file}`
        }

        if (payload.type === AttachmentType.EMO) {
          remotePath += `EMO/${file}`
          localPath += `emo_${file}`
        }

        // const remotePath = `./prueba _ftp/empresas/certificado/${file}`;
        // const localPath = `./temp/certificado_${file}`;

        logger.info(
          `AttachmentsService.downloadAttachment | init | ${remotePath}`
        )

        const result = await this.client.downloadTo(localPath, remotePath)

        logger.info('AttachmentsService.downloadAttachment | end download')

        logger.info(
          `Downloaded ${file} from FTP server. ${JSON.stringify(result)}`
        )
      }

      this.client.close()

      logger.info('All attachments downloaded successfully.')

      const zip = new AdmZip()

      for (const file of files) {
        if (payload.type === AttachmentType.CERTIFICADO) {
          zip.addLocalFile(`./temp/certificado_${file}`)
        }

        if (payload.type === AttachmentType.EMO) {
          zip.addLocalFile(`./temp/emo_${file}`)
        }

        // zip.addLocalFile(`./temp/certificado_${file}`);
      }

      const zipBuffer = zip.toBuffer()

      const timestamp = new Date().getTime()

      if (payload.type === AttachmentType.CERTIFICADO) {
        zip.writeZip(`./temp/certificados_${timestamp}.zip`)
      }

      if (payload.type === AttachmentType.EMO) {
        zip.writeZip(`./temp/emos_${timestamp}.zip`)
      }

      // zip.writeZip(`./temp/certificados_${timestamp}.zip`);

      return zipBuffer
    } catch (error: unknown) {
      console.error(error)
      throw new Error(`${(error as Error).message}`)
    }
  }
}
