import crypto from 'crypto'
import path from 'path'
import { mkdir, writeFile } from 'fs/promises'
import { NextRequest, NextResponse } from 'next/server'
import CommonsService from '@/src/server/commons/services/commons.service'
import { authenticateRequest } from '@/src/server/http/auth'
import { logger } from '@/src/server/shared'

const commonsService = new CommonsService()
const TEMP_DIR = path.join(process.cwd(), 'temp')

type UploadData = {
  filepath: string
  mimetype: string
}

function getFileContentType(fileName: string): string {
  const extension = fileName.split('.').pop()?.toLowerCase()

  switch (extension) {
    case 'pdf':
      return 'application/pdf'
    case 'png':
      return 'image/png'
    case 'jpg':
      return 'image/jpg'
    case 'jpeg':
      return 'image/jpeg'
    default:
      return 'application/octet-stream'
  }
}

async function getUploadData(request: NextRequest): Promise<UploadData | null> {
  const formData = await request.formData()
  const file = formData.get('file')

  if (!(file instanceof File)) {
    return null
  }

  await mkdir(TEMP_DIR, { recursive: true })

  const originalFilename = file.name || `${crypto.randomUUID()}.bin`
  const extension = path.extname(originalFilename)
  const tempFileName = `${crypto.randomUUID()}${extension}`
  const fullFilePath = path.join(TEMP_DIR, tempFileName)
  const bytes = Buffer.from(await file.arrayBuffer())

  await writeFile(fullFilePath, bytes)

  return {
    filepath: fullFilePath.replace(/\\/g, '/'),
    mimetype: file.type
  }
}

export async function handleHeadquarters(
  request: NextRequest
): Promise<NextResponse> {
  const auth = authenticateRequest(request)

  if (!auth.ok) {
    return auth.response
  }

  try {
    logger.info('Executing get all headquarters')

    const data = await commonsService.findAllHeadquarters()

    return NextResponse.json(
      {
        status: true,
        data
      },
      { status: 200 }
    )
  } catch (error: unknown) {
    logger.error((error as Error).message)

    return NextResponse.json(
      {
        status: false,
        message: 'Error while trying get all headquarters'
      },
      { status: 500 }
    )
  }
}

export async function handleExamTypes(
  request: NextRequest
): Promise<NextResponse> {
  const auth = authenticateRequest(request)

  if (!auth.ok) {
    return auth.response
  }

  try {
    logger.info('Executing get all exam types')

    const data = await commonsService.findAllExamTypes()

    return NextResponse.json(
      {
        status: true,
        data
      },
      { status: 200 }
    )
  } catch (error: unknown) {
    logger.error((error as Error).message)

    return NextResponse.json(
      {
        status: false,
        message: 'Error while trying get all exam types'
      },
      { status: 500 }
    )
  }
}

export async function handleEpidemiologicalReport(
  request: NextRequest
): Promise<NextResponse> {
  const auth = authenticateRequest(request)

  if (!auth.ok) {
    return auth.response
  }

  try {
    const epidemiological_report =
      await commonsService.findEpidemiologicalReport(
        String(auth.user.ruc ?? '')
      )

    return NextResponse.json(
      {
        status: true,
        data: {
          epidemiological_report
        }
      },
      { status: 200 }
    )
  } catch (error: unknown) {
    logger.error((error as Error).message)

    return NextResponse.json(
      {
        status: false,
        message: 'Error while trying find epidemiological report.'
      },
      { status: 500 }
    )
  }
}

export async function handleDownloadEpidemiologicalReport(
  request: NextRequest,
  uid: string | undefined
): Promise<NextResponse> {
  const auth = authenticateRequest(request)

  if (!auth.ok) {
    return auth.response
  }

  if (!uid) {
    return NextResponse.json(
      {
        status: false,
        message: 'Missing report id'
      },
      { status: 400 }
    )
  }

  try {
    logger.info(`Executing download epidemiological report: ${uid}`)

    const file = await commonsService.downloadEpidemiologicalReport(uid)

    return NextResponse.json(
      {
        status: true,
        data: {
          file
        }
      },
      { status: 200 }
    )
  } catch (error: unknown) {
    logger.error((error as Error).message)

    return NextResponse.json(
      {
        status: false,
        message: 'Error while trying download epidemiological report.'
      },
      { status: 500 }
    )
  }
}

export async function handleDownloadFile(
  request: NextRequest,
  uid: string | undefined
): Promise<NextResponse> {
  const auth = authenticateRequest(request)

  if (!auth.ok) {
    return auth.response
  }

  if (!uid) {
    return NextResponse.json(
      {
        status: false,
        message: 'Missing file id'
      },
      { status: 400 }
    )
  }

  try {
    logger.info(`Executing download file: ${uid}`)

    const file = await commonsService.downloadFile(uid)
    const contentType = getFileContentType(uid)

    logger.info('File downloaded successfully')

    return new NextResponse(new Uint8Array(file), {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename=${uid}`,
        'Content-length': file.length.toString()
      }
    })
  } catch (error: unknown) {
    logger.error((error as Error).message)

    return NextResponse.json(
      {
        status: false,
        message: 'Error while trying download file'
      },
      { status: 500 }
    )
  }
}

export async function handleUploadPhoto(
  request: NextRequest
): Promise<NextResponse> {
  const auth = authenticateRequest(request)

  if (!auth.ok) {
    return auth.response
  }

  try {
    logger.info(`User: ${JSON.stringify(auth.user)}`)

    const upload = await getUploadData(request)

    if (!upload) {
      return NextResponse.json(
        {
          status: false,
          message: 'No files uploaded.'
        },
        { status: 400 }
      )
    }

    const fileName = await commonsService.uploadPhoto(
      upload.filepath,
      upload.mimetype
    )
    const localFile = await commonsService.getPhoto(fileName)

    await commonsService.updatePhotoURL(fileName, String(auth.user.sub ?? ''))

    return NextResponse.json(
      {
        status: true,
        data: {
          file: {
            fileName,
            localFile
          }
        },
        message: 'File uploaded successfully.'
      },
      { status: 200 }
    )
  } catch (error: unknown) {
    logger.error((error as Error).message)

    return NextResponse.json(
      {
        status: false,
        message: 'Error while trying to upload photo'
      },
      { status: 500 }
    )
  }
}

export async function handleGetPhoto(
  request: NextRequest,
  photoId: string | undefined
): Promise<NextResponse> {
  const auth = authenticateRequest(request)

  if (!auth.ok) {
    return auth.response
  }

  if (!photoId) {
    return NextResponse.json(
      {
        status: false,
        message: 'Missing photo id'
      },
      { status: 400 }
    )
  }

  try {
    const file = await commonsService.getPhoto(photoId)

    logger.info('Photo downloaded successfully')

    return NextResponse.json(
      {
        status: true,
        data: {
          file
        },
        message: 'Photo downloaded successfully.'
      },
      { status: 200 }
    )
  } catch (error: unknown) {
    logger.error((error as Error).message)

    return NextResponse.json(
      {
        status: false,
        message: 'Error while trying to download photo.'
      },
      { status: 500 }
    )
  }
}

export async function handleDeletePhoto(
  request: NextRequest,
  photoId: string | undefined
): Promise<NextResponse> {
  const auth = authenticateRequest(request)

  if (!auth.ok) {
    return auth.response
  }

  if (!photoId) {
    return NextResponse.json(
      {
        status: false,
        message: 'Missing photo id'
      },
      { status: 400 }
    )
  }

  try {
    logger.info(`Deleting photo: ${photoId}`)

    await commonsService.deletePhoto(photoId)

    return NextResponse.json(
      {
        status: true,
        message: 'Photo deleted successfully.'
      },
      { status: 200 }
    )
  } catch (error: unknown) {
    logger.error((error as Error).message)

    return NextResponse.json(
      {
        status: false,
        message: 'Error while trying to delete photo.'
      },
      { status: 500 }
    )
  }
}
