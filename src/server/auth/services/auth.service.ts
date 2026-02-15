import { JWT_SECRET, SMBClient, logger } from '../../shared'
import JWT from '../../shared/jwt'
import { UserUpdateDTO } from '../dto/user-update.dto'
import { User } from '../models/user'
import AuthRepository from '../repository/auth.repository'

export default class AuthService {
  private readonly repository: AuthRepository
  private readonly jwt: JWT
  private readonly sambaClient: SMBClient

  constructor() {
    this.repository = new AuthRepository()
    this.sambaClient = new SMBClient()
    this.jwt = new JWT({
      secret: JWT_SECRET,
    })
  }

  async login(username: string, password: string): Promise<object> {
    const patient = await this.repository.findByDniAndPass(username, password)
    
    if (!patient) {
      throw new Error('Invalid credentials')
    }

    logger.info(`User ${JSON.stringify(patient)} logged in`)

    const accessToken = this.jwt.sign({
      sub: patient.dni,
      profile: patient.usr_perfil,
      ruc: patient.usr_ruc,
    })

    const user = {
      dni: patient.dni,
      first_name: patient.usr_nombres,
      last_name: patient.usr_apellidos,
      email: patient.usr_mail,
      profile: patient.usr_perfil,
      ruc: patient.usr_ruc,
      business_name: patient.empresa
    }

    return {
      token: {
        accessToken,
        refreshToken: '',
      },
      user,
    }
  }

  async verify(accessToken: string): Promise<object> {
    return this.jwt.verify(accessToken)
  }

  async getProfile(dni: string): Promise<User | null> {
    return this.repository.findByDni(dni)
  }

  async update(dni: string, data: UserUpdateDTO): Promise<boolean> {
    return this.repository.update(dni, data)
  }

  async updatePhoto(originalFilename: string, localFilePath: string): Promise<boolean> {
    const remoteFilePath = `/FOTOUS/${originalFilename}`

    logger.info(`Uploading photo ${localFilePath} to ${remoteFilePath}`)

    await this.sambaClient.uploadFile(localFilePath, remoteFilePath)

    return true
  }
}


