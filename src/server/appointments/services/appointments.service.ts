import 'moment/locale/es'
import * as nodemailer from 'nodemailer'
import moment from 'moment-timezone'
import { logger } from '../../shared'

moment.tz.setDefault('America/Lima')

export default class AppointmentsService {
  private readonly EMAIL_APPOINTMENTS_HOST: string =
    process.env.EMAIL_APPOINTMENTS_HOST || ''
  private readonly EMAIL_APPOINTMENTS: string =
    process.env.EMAIL_APPOINTMENTS || ''
  private readonly EMAIL_APPOINTMENTS_PASSWORD: string =
    process.env.EMAIL_APPOINTMENTS_PASSWORD || ''
  private readonly EMAIL_APPOINTMENTS_SUBJECT: string =
    process.env.EMAIL_APPOINTMENTS_SUBJECT || ''

  async createAppointment(file: Buffer, dni: string): Promise<void> {
    try {
      const transporter = nodemailer.createTransport({
        host: this.EMAIL_APPOINTMENTS_HOST,
        port: 465,
        secure: true,
        auth: {
          user: this.EMAIL_APPOINTMENTS,
          pass: this.EMAIL_APPOINTMENTS_PASSWORD
        }
      })

      const filename = `citas_${moment().format('YYYY-MM-DD')}.xlsx`

      logger.info(`Sending email to ${this.EMAIL_APPOINTMENTS}`)

      const info = await transporter.sendMail({
        from: `"Citas Lucemedic" <${this.EMAIL_APPOINTMENTS}>`, // sender address
        // to: 'mvegaplm@gmail.com',
        to: `${this.EMAIL_APPOINTMENTS}`,
        subject: `${this.EMAIL_APPOINTMENTS_SUBJECT}`, // Subject line
        text: 'Programación de citas', // plain text body
        html: `Programación de citas generada por el usuario: <b>DNI ${dni}</b><br/>Fecha: ${moment(new Date().toISOString()).format('MMMM Do YYYY, h:mm:ss a')}`, // html body
        attachments: [
          {
            filename,
            content: file
          }
        ]
      })

      logger.info(`Message sent: ${info.messageId}`)
    } catch (error: unknown) {
      throw new Error((error as Error).message)
    }
  }
}
