import { logger } from '../../shared'
import { StatisticsQueryDTO } from '../dto/statistics.query.dto'
import {
  Age,
  BloodPressure,
  MedicalFitness,
  NutritionalProfile,
  OsteoMuscularPathologies,
  Exam,
  Audiometry,
  VisualAcuity,
  Odontology,
  StructuralHeight,
  Psychology,
  Electrocardiogram,
  ChestXRay,
  OtherConditions
} from '../repository/entity'
import { Spirometry } from '../repository/entity/spirometry'
import { IStatisticsRepository } from '../repository/interfaces/statistics.repository.interface'
import StatisticsRepository from '../repository/statistics.repository'

export default class StatisticsService {
  private readonly repository: IStatisticsRepository

  constructor() {
    this.repository = new StatisticsRepository()
  }

  async findGenders(query: StatisticsQueryDTO, ruc: string): Promise<object> {
    let result = {
      masculino: '0.00',
      femenino: '0.00'
    }
    const data = await this.repository.findGenders(query, ruc)

    logger.info(`StatisticsService.findGenders | data: ${JSON.stringify(data)}`)

    if (data.length === 0) {
      logger.error(
        `StatisticsService.findGenders | Error: ${JSON.stringify(data)}`
      )
      return result
    }

    const total = data[0].total
    const masculino =
      total !== 0 ? ((data[0].masculino / total) * 100).toFixed(2) : '0.00'
    const femenino =
      total !== 0 ? ((data[0].femenino / total) * 100).toFixed(2) : '0.00'

    result = {
      masculino,
      femenino
    }

    return result
  }

  async findAges(query: StatisticsQueryDTO, ruc: string): Promise<Age[]> {
    let result: Age[] = []
    const data = await this.repository.findAges(query, ruc)

    logger.info(`StatisticsService.findAges | data: ${JSON.stringify(data)}`)

    if (data.length === 0) {
      logger.error(
        `StatisticsService.findAges | Error: ${JSON.stringify(data)}`
      )
      return result
    }

    result = data

    return result
  }

  async findMedicalFitness(
    query: StatisticsQueryDTO,
    ruc: string
  ): Promise<MedicalFitness[]> {
    const data = await this.repository.findMedicalFitness(query, ruc)

    return data
  }

  async findNutritionalProfile(
    query: StatisticsQueryDTO,
    ruc: string
  ): Promise<NutritionalProfile[]> {
    const data = await this.repository.findNutritionalProfile(query, ruc)

    const dataFiltrada = data.filter((item) => item.categoria !== 'TOTAL')

    const totalCantidad = dataFiltrada.reduce(
      (total, item) => total + item.cantidad,
      0
    )

    const result = dataFiltrada.map((item) => ({
      categoria: item.categoria,
      cantidad: totalCantidad !== 0 ? (item.cantidad / totalCantidad) * 100 : 0
    }))

    result.forEach((item) => {
      item.cantidad = parseFloat(item.cantidad.toFixed(2))
    })

    return result
  }

  async findBloodPressure(
    query: StatisticsQueryDTO,
    ruc: string
  ): Promise<BloodPressure[]> {
    const result: BloodPressure[] = []
    const data = await this.repository.findBloodPressure(query, ruc)

    logger.info(
      `StatisticsService.findBloodPressure | data: ${JSON.stringify(data)}`
    )

    if (data.length === 0) {
      logger.error(
        `StatisticsService.findBloodPressure | Error: ${JSON.stringify(data)}`
      )
      return result
    }

    const dataFiltrada = data.filter((item) => item.categoria !== 'TOTAL')

    const normal = data.filter((item) => item.categoria === 'TOTAL')[0].cantidad
    const anormal = dataFiltrada
      .map((item) => item.cantidad)
      .reduce((acc, curr) => acc + curr, 0)

    const bloodPressure = [
      {
        categoria: 'DENTRO DE LOS LÍMITES NORMALES',
        cantidad: (normal / (normal + anormal)) * 100
      },
      {
        categoria: 'FUERA DE LOS LÍMITES NORMALES',
        cantidad: (anormal / (normal + anormal)) * 100
      }
    ] satisfies BloodPressure[]

    return bloodPressure
  }

  async findOsteoMuscularPathologies(
    query: StatisticsQueryDTO,
    ruc: string
  ): Promise<OsteoMuscularPathologies[]> {
    let result: OsteoMuscularPathologies[] = []
    const data = await this.repository.findOsteoMuscularPathologies(query, ruc)

    logger.info(
      `StatisticsService.findOsteoMuscularPathologies | data: ${JSON.stringify(data)}`
    )

    if (data.length === 0) {
      logger.error(
        `StatisticsService.findOsteoMuscularPathologies | Error: ${JSON.stringify(data)}`
      )
      return result
    }

    const dataFiltrada = data.filter((item) => item.categoria !== 'TOTAL')

    const totalCantidad = dataFiltrada.reduce(
      (total, item) => total + item.cantidad,
      0
    )

    result = dataFiltrada.map((item) => ({
      categoria: item.categoria,
      cantidad: totalCantidad !== 0 ? (item.cantidad / totalCantidad) * 100 : 0
    }))

    result.forEach((item) => {
      item.cantidad = parseFloat(item.cantidad.toFixed(2))
    })

    return result
  }

  async findExams(query: StatisticsQueryDTO, ruc: string): Promise<Exam[]> {
    let result: Exam[] = []
    const data = await this.repository.findExams(query, ruc)

    logger.info(`StatisticsService.findExams | data: ${JSON.stringify(data)}`)

    if (data.length === 0) {
      logger.error(
        `StatisticsService.findExams | Error: ${JSON.stringify(data)}`
      )
      return result
    }

    const dataFiltrada = data.filter((item) => item.categoria !== 'TOTAL')

    const totalCantidad = dataFiltrada.reduce(
      (total, item) => total + item.cantidad,
      0
    )

    result = dataFiltrada.map((item) => ({
      categoria: item.categoria,
      cantidad: totalCantidad !== 0 ? (item.cantidad / totalCantidad) * 100 : 0
    }))

    result.forEach((item) => {
      item.cantidad = parseFloat(item.cantidad.toFixed(2))
    })

    return result
  }

  async findAudiometry(
    query: StatisticsQueryDTO,
    ruc: string
  ): Promise<Audiometry[]> {
    let result: Audiometry[] = []
    const data = await this.repository.findAudiometry(query, ruc)

    logger.info(
      `StatisticsService.findAudiometry | data: ${JSON.stringify(data)}`
    )

    if (data.length === 0) {
      logger.error(
        `StatisticsService.findAudiometry | Error: ${JSON.stringify(data)}`
      )
      return result
    }

    const dataFiltrada = data.filter((item) => item.categoria !== 'TOTAL')

    const totalCantidad = dataFiltrada.reduce(
      (total, item) => total + item.cantidad,
      0
    )

    result = dataFiltrada.map((item) => ({
      categoria: item.categoria,
      cantidad: totalCantidad !== 0 ? (item.cantidad / totalCantidad) * 100 : 0
    }))

    result.forEach((item) => {
      item.cantidad = parseFloat(item.cantidad.toFixed(2))
    })

    return result
  }

  async findSpirometry(
    query: StatisticsQueryDTO,
    ruc: string
  ): Promise<Spirometry[]> {
    let result: Spirometry[] = []
    const data = await this.repository.findSpirometry(query, ruc)

    logger.info(
      `StatisticsService.findSpirometry | data: ${JSON.stringify(data)}`
    )

    if (data.length === 0) {
      logger.error(
        `StatisticsService.findSpirometry | Error: ${JSON.stringify(data)}`
      )
      return result
    }

    const dataFiltrada = data.filter((item) => item.categoria !== 'TOTAL')

    const totalCantidad = dataFiltrada.reduce(
      (total, item) => total + item.cantidad,
      0
    )

    result = dataFiltrada.map((item) => ({
      categoria: item.categoria,
      cantidad: totalCantidad !== 0 ? (item.cantidad / totalCantidad) * 100 : 0
    }))

    result.forEach((item) => {
      item.cantidad = parseFloat(item.cantidad.toFixed(2))
    })

    return result
  }

  async findVisualAcuity(
    query: StatisticsQueryDTO,
    ruc: string
  ): Promise<VisualAcuity[]> {
    let result: VisualAcuity[] = []
    const data = await this.repository.findVisualAcuity(query, ruc)

    logger.info(
      `StatisticsService.findVisualAcuity | data: ${JSON.stringify(data)}`
    )

    if (data.length === 0) {
      logger.error(
        `StatisticsService.findVisualAcuity | Error: ${JSON.stringify(data)}`
      )
      return result
    }

    const dataFiltrada = data.filter((item) => item.categoria !== 'TOTAL')

    const totalCantidad = dataFiltrada.reduce(
      (total, item) => total + item.cantidad,
      0
    )

    result = dataFiltrada.map((item) => ({
      categoria: item.categoria,
      cantidad: totalCantidad !== 0 ? (item.cantidad / totalCantidad) * 100 : 0
    }))

    result.forEach((item) => {
      item.cantidad = parseFloat(item.cantidad.toFixed(2))
    })

    return result
  }

  async findOtherConditions(
    query: StatisticsQueryDTO,
    ruc: string
  ): Promise<OtherConditions[]> {
    let result: OtherConditions[] = []
    const data = await this.repository.findOtherConditions(query, ruc)

    logger.info(
      `StatisticsService.findOtherConditions | data: ${JSON.stringify(data)}`
    )

    if (data.length === 0) {
      logger.error(
        `StatisticsService.findOtherConditions | Error: ${JSON.stringify(data)}`
      )
      return result
    }

    const dataFiltrada = data.filter((item) => item.categoria !== 'TOTAL')

    const totalCantidad = dataFiltrada.reduce(
      (total, item) => total + item.cantidad,
      0
    )

    result = dataFiltrada.map((item) => ({
      categoria: item.categoria,
      cantidad: totalCantidad !== 0 ? (item.cantidad / totalCantidad) * 100 : 0
    }))

    result.forEach((item) => {
      item.cantidad = parseFloat(item.cantidad.toFixed(2))
    })

    return result
  }

  async findChestXRay(
    query: StatisticsQueryDTO,
    ruc: string
  ): Promise<ChestXRay[]> {
    let result: ChestXRay[] = []
    let data = await this.repository.findChestXRay(query, ruc)

    logger.info(
      `StatisticsService.findChestXRay | data: ${JSON.stringify(data)}`
    )

    if (data.length === 0) {
      logger.error(
        `StatisticsService.findChestXRay | Error: ${JSON.stringify(data)}`
      )
      return result
    }

    const total =
      data.filter((item) => item.categoria === 'TOTAL')[0].cantidad || 0
    const normal =
      data.filter((item) => item.categoria === 'NORMAL')[0].cantidad || 0
    const hallazgos = total - normal

    data = [
      { categoria: 'NORMAL', cantidad: (normal / total) * 100 },
      { categoria: 'HALLAZGOS', cantidad: (hallazgos / total) * 100 }
    ]

    data.forEach((item) => {
      item.cantidad = parseFloat(item.cantidad.toFixed(2))
    })

    result = data

    return result
  }

  async findElectrocardiogram(
    query: StatisticsQueryDTO,
    ruc: string
  ): Promise<Electrocardiogram[]> {
    let result: Electrocardiogram[] = []
    let data = await this.repository.findElectrocardiogram(query, ruc)

    logger.info(
      `StatisticsService.findElectrocardiogram | data: ${JSON.stringify(data)}`
    )

    if (data.length === 0) {
      logger.error(
        `StatisticsService.findElectrocardiogram | Error: ${JSON.stringify(data)}`
      )
      return result
    }

    const total =
      data.filter((item) => item.categoria === 'TOTAL')[0].cantidad || 0
    const normal =
      data.filter((item) => item.categoria === 'NORMAL')[0].cantidad || 0
    const hallazgos = total - normal

    data = [
      { categoria: 'NORMAL', cantidad: (normal / total) * 100 },
      { categoria: 'HALLAZGOS', cantidad: (hallazgos / total) * 100 }
    ]

    data.forEach((item) => {
      item.cantidad = parseFloat(item.cantidad.toFixed(2))
    })

    result = data

    return result
  }

  async findPsychology(
    query: StatisticsQueryDTO,
    ruc: string
  ): Promise<Psychology[]> {
    let result: Psychology[] = []
    let data = await this.repository.findPsychology(query, ruc)

    logger.info(
      `StatisticsService.findPsychology | data init: ${JSON.stringify(data)}`
    )

    if (data.length === 0) {
      logger.error(
        `StatisticsService.findPsychology | Error: ${JSON.stringify(data)}`
      )
      return result
    }

    const total =
      data.filter((item) => item.categoria === 'TOTAL')[0].cantidad || 0
    const normal =
      data.filter((item) => item.categoria === 'APTO')[0].cantidad || 0
    const hallazgos = total - normal

    data = [
      { categoria: 'APTO', cantidad: (normal / total) * 100 },
      { categoria: 'NO APTO', cantidad: (hallazgos / total) * 100 }
    ]

    data.forEach((item) => {
      item.cantidad = parseFloat(item.cantidad.toFixed(2))
    })

    logger.info(
      `StatisticsService.findPsychology | data result: ${JSON.stringify(data)}`
    )

    result = data

    return result
  }

  async findStructuralHeight(
    query: StatisticsQueryDTO,
    ruc: string
  ): Promise<StructuralHeight[]> {
    let result: StructuralHeight[] = []
    const data = await this.repository.findStructuralHeight(query, ruc)

    logger.info(
      `StatisticsService.findStructuralHeight | data: ${JSON.stringify(data)}`
    )

    if (data.length === 0) {
      logger.error(
        `StatisticsService.findStructuralHeight | Error: ${JSON.stringify(data)}`
      )
      return result
    }

    result = data

    return result
  }

  async findOdontology(
    query: StatisticsQueryDTO,
    ruc: string
  ): Promise<Odontology[]> {
    let result: Odontology[] = []
    const data = await this.repository.findOdontology(query, ruc)

    logger.info(
      `StatisticsService.findOdontology | data: ${JSON.stringify(data)}`
    )

    if (data.length === 0) {
      logger.error(
        `StatisticsService.findOdontology | Error: ${JSON.stringify(data)}`
      )
      return result
    }

    const dataFiltrada = data.filter((item) => item.categoria !== 'TOTAL')

    const totalCantidad = dataFiltrada.reduce(
      (total, item) => total + item.cantidad,
      0
    )

    result = dataFiltrada.map((item) => ({
      categoria: item.categoria,
      cantidad: totalCantidad !== 0 ? (item.cantidad / totalCantidad) * 100 : 0
    }))

    result.forEach((item) => {
      item.cantidad = parseFloat(item.cantidad.toFixed(2))
    })

    return result
  }

  async check(query: StatisticsQueryDTO, ruc: string): Promise<boolean> {
    return this.repository.check(query, ruc)
  }
}
