import { AttentionMonitoringQueryDTO } from '../dto/attention-monitoring.query.dto'
import AttentionMonitoringRepository from '../repository/attention-monitoring.repository'
import { AttentionMonitoring } from '../repository/entity/attention-monitoring'
import { IAttentionMonitoringRepository } from '../repository/interfaces/attention-monitoring.repository.interface'

export default class AttentionMonitoringService {
  private readonly repository: IAttentionMonitoringRepository

  constructor() {
    this.repository = new AttentionMonitoringRepository()
  }

  async find(params: AttentionMonitoringQueryDTO, ruc: string): Promise<AttentionMonitoring[]> {
    return this.repository.find(params, ruc)
  }
}
