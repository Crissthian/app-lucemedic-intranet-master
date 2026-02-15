import { NextRequest, NextResponse } from 'next/server'
import AppointmentsService from '@/src/server/appointments/services/appointments.service'
import { authenticateRequest } from '@/src/server/http/auth'
import { logger } from '@/src/server/shared'

const appointmentsService = new AppointmentsService()

export async function handleCreateAppointment(
  request: NextRequest,
): Promise<NextResponse> {
  const auth = authenticateRequest(request)

  if (!auth.ok) {
    return auth.response
  }

  try {
    const formData = await request.formData()
    const file = formData.get('file')

    if (!(file instanceof File)) {
      return NextResponse.json(
        {
          status: false,
          message: 'No files uploaded.',
        },
        { status: 400 },
      )
    }

    logger.info(`Creating appointment with file: ${file.name}`)

    const fileBuffer = Buffer.from(await file.arrayBuffer())

    await appointmentsService.createAppointment(fileBuffer, String(auth.user.sub))

    return NextResponse.json(
      {
        status: true,
        data: {},
        message: 'Appointment created successfully.',
      },
      { status: 200 },
    )
  } catch (error: unknown) {
    logger.error('Error while trying to create an appointment.')
    logger.error((error as Error).message)

    return NextResponse.json(
      {
        status: false,
        message: 'Error while trying to create appointment.',
      },
      { status: 500 },
    )
  }
}
