import { AttentionMonitoringQueryDTO } from '../../dto/attention-monitoring.query.dto'
import { AttentionMonitoring } from '../entity/attention-monitoring'

export interface IAttentionMonitoringRepository {
  find(params: AttentionMonitoringQueryDTO, ruc: string): Promise<AttentionMonitoring[]>;
}

