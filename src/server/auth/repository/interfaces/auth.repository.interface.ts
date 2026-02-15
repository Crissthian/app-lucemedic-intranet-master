import { User } from '../../models/user'

export interface IAuthRepository {
  findByDniAndPass(dni: string, pass: string): Promise<User | null>
  findByDni(dni: string): Promise<User | null>
}
