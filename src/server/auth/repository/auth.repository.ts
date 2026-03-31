import {
  DB_HOST,
  DB_NAME,
  DB_PASS,
  DB_USER,
  DB_INSTANCE,
  Database
} from '../../shared'
import { UserUpdateDTO } from '../dto/user-update.dto'
import { User } from '../models/user'
import { IAuthRepository } from './interfaces/auth.repository.interface'

export default class AuthRepository implements IAuthRepository {
  private readonly database: Database

  constructor() {
    this.database = new Database({
      server: DB_HOST,
      user: DB_USER,
      password: DB_PASS,
      database: DB_NAME,
      options: {
        encrypt: false,
        trustServerCertificate: true,
        instanceName: DB_INSTANCE
      }
    })
  }

  async findByDniAndPass(dni: string, pass: string): Promise<User | null> {
    try {
      const query = `SELECT UI.dni,UI.usr_apellidos,UI.usr_nombres,UI.usr_mail,UI.usr_foto,UI.usr_perfil,UI.usr_ruc,RTRIM(LTRIM(VC.DES_CLI)) AS empresa, RTRIM(LTRIM(UI.cmp)) AS cmp, UI.usr_swt from m_User_Intranet UI, vclientes VC where UI.usr_ruc=VC.RUC_CLI AND UI.dni=@dni AND UI.usr_pass=@pass`

      const result = await this.database.queryWithParams<User & { usr_swt: number }>(query, {
        dni,
        pass
      })

      if (!result.success || result.data.length === 0) {
        return null
      }

      const user = result.data[0]

      if (user.usr_swt === 1) {
        throw new Error('Account disabled')
      }

      return user
    } catch (error: any) {
      if (error instanceof Error && error.message === 'Account disabled') {
        throw error
      }
      throw new Error('Error al obtener los datos del usuario')
    }
  }

  async findByDni(dni: string): Promise<User | null> {
    try {
      const query = `SELECT UI.dni,UI.usr_apellidos,UI.usr_nombres,UI.usr_mail,UI.usr_foto,UI.usr_perfil,UI.usr_ruc,RTRIM(LTRIM(VC.DES_CLI)) AS empresa, RTRIM(LTRIM(ui.cmp)) as cmp from m_User_Intranet UI, vclientes VC where UI.usr_ruc=VC.RUC_CLI AND UI.dni=@dni and ui.usr_swt=0`

      const result = await this.database.queryWithParams<User>(query, {
        dni
      })

      if (!result.success) {
        return null
      }

      return result.data[0]
    } catch {
      throw new Error('Error al obtener los datos del usuario')
    }
  }

  async update(dni: string, data: UserUpdateDTO): Promise<boolean> {
    try {
      const query = `UPDATE m_User_Intranet SET usr_apellidos=@lastName,usr_nombres=@firstName, usr_mail=@email, cmp=@cmp WHERE dni=@dni`

      await this.database.queryWithParams<User>(query, {
        dni,
        lastName: data.lastName,
        firstName: data.firstName,
        email: data.email,
        cmp: data.cmp
      })

      return true
    } catch {
      throw new Error('Error al actualizar los datos del usuario')
    }
  }

  async updatePhoto(dni: string, photoFileName: string): Promise<boolean> {
    try {
      const query = `UPDATE m_User_Intranet SET usr_foto=@photoFileName WHERE dni=@dni`

      await this.database.queryWithParams<User>(query, {
        dni,
        photoFileName
      })

      return true
    } catch {
      throw new Error('Error al actualizar la foto del usuario')
    }
  }
}
