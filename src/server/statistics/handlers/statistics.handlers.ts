import { NextRequest, NextResponse } from 'next/server'
import { StatisticsQueryDTO } from '@/src/server/statistics/dto/statistics.query.dto'
import StatisticsService from '@/src/server/statistics/services/statistics.service'
import { authenticateRequest } from '@/src/server/http/auth'
import { logger } from '@/src/server/shared'

const statisticsService = new StatisticsService()

type MetricConfig = {
  responseKey: string;
  resolve: (query: StatisticsQueryDTO, ruc: string) => Promise<unknown>;
};

const metrics: Record<string, MetricConfig> = {
  genders: {
    responseKey: 'genders',
    resolve: (query, ruc) => statisticsService.findGenders(query, ruc),
  },
  ages: {
    responseKey: 'ages',
    resolve: (query, ruc) => statisticsService.findAges(query, ruc),
  },
  'medical-fitness': {
    responseKey: 'medical_fitness',
    resolve: (query, ruc) => statisticsService.findMedicalFitness(query, ruc),
  },
  'nutritional-profile': {
    responseKey: 'nutritional_profile',
    resolve: (query, ruc) => statisticsService.findNutritionalProfile(query, ruc),
  },
  'blood-pressure': {
    responseKey: 'blood_pressure',
    resolve: (query, ruc) => statisticsService.findBloodPressure(query, ruc),
  },
  'osteo-muscular-pathologies': {
    responseKey: 'osteo_muscular_pathologies',
    resolve: (query, ruc) =>
      statisticsService.findOsteoMuscularPathologies(query, ruc),
  },
  exams: {
    responseKey: 'exams',
    resolve: (query, ruc) => statisticsService.findExams(query, ruc),
  },
  audiometry: {
    responseKey: 'audiometry',
    resolve: (query, ruc) => statisticsService.findAudiometry(query, ruc),
  },
  spirometry: {
    responseKey: 'spirometry',
    resolve: (query, ruc) => statisticsService.findSpirometry(query, ruc),
  },
  'visual-acuity': {
    responseKey: 'visual_acuity',
    resolve: (query, ruc) => statisticsService.findVisualAcuity(query, ruc),
  },
  'other-conditions': {
    responseKey: 'other_conditions',
    resolve: (query, ruc) => statisticsService.findOtherConditions(query, ruc),
  },
  'chest-x-ray': {
    responseKey: 'chest_x_ray',
    resolve: (query, ruc) => statisticsService.findChestXRay(query, ruc),
  },
  electrocardiogram: {
    responseKey: 'electrocardiogram',
    resolve: (query, ruc) => statisticsService.findElectrocardiogram(query, ruc),
  },
  psychology: {
    responseKey: 'psychology',
    resolve: (query, ruc) => statisticsService.findPsychology(query, ruc),
  },
  'structural-height': {
    responseKey: 'structural_height',
    resolve: (query, ruc) => statisticsService.findStructuralHeight(query, ruc),
  },
  odontology: {
    responseKey: 'odontology',
    resolve: (query, ruc) => statisticsService.findOdontology(query, ruc),
  },
  check: {
    responseKey: 'check',
    resolve: (query, ruc) => statisticsService.check(query, ruc),
  },
}

function getQueryObject(request: NextRequest): Record<string, string> {
  const result: Record<string, string> = {}

  request.nextUrl.searchParams.forEach((value, key) => {
    result[key] = value
  })

  return result
}

export async function handleStatisticsMetric(
  request: NextRequest,
  metric: string | undefined,
): Promise<NextResponse> {
  const auth = authenticateRequest(request)

  if (!auth.ok) {
    return auth.response
  }

  const metricConfig = metric ? metrics[metric] : undefined

  if (!metricConfig) {
    return NextResponse.json(
      {
        status: false,
        message: 'Route not found',
      },
      { status: 404 },
    )
  }

  try {
    const query = getQueryObject(request) as unknown as StatisticsQueryDTO
    const ruc = String(auth.user.ruc ?? '')

    logger.info(`Gettings statistics ${metric} ${JSON.stringify(query)} | ${ruc}`)

    const data = await metricConfig.resolve(query, ruc)

    return NextResponse.json(
      {
        status: true,
        data: {
          [metricConfig.responseKey]: data,
        },
      },
      { status: 200 },
    )
  } catch (error: unknown) {
    logger.error((error as Error).message)

    return NextResponse.json(
      {
        status: false,
        message: (error as Error).message,
      },
      { status: 500 },
    )
  }
}
