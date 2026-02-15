import { AptitudQueryDTO } from '../dto/aptitud.query.dto'
import { SabanaQueryDTO } from '../dto/sabana.query.dto'
import SabanaRepository from '../repository/sabana.repository'

export default class SabanaService {
  private readonly repository: SabanaRepository

  constructor() {
    this.repository = new SabanaRepository()
  }

  async find(params: SabanaQueryDTO, ruc: string): Promise<object[]> {
    return this.repository.find(params, ruc)
  }

  async findAptitud(params: AptitudQueryDTO, ruc: string): Promise<object[]> {
    return this.repository.findAptitud(params, ruc)
  }

  async findInterconsultations(params: SabanaQueryDTO, ruc: string): Promise<object[]> {
    return this.repository.findInterconsultations(params, ruc)
  }
}
