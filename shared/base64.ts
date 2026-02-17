/**
 * Decodes a base64 string to a Blob
 * @param base64Data - The base64 encoded string
 * @param mimeType - The MIME type of the file (default: 'application/pdf')
 * @returns A Blob containing the decoded data
 */
export function base64ToBlob(
  base64Data: string,
  mimeType: string = 'application/pdf'
): Blob {
  const binaryString = atob(base64Data)
  const bytes = new Uint8Array(binaryString.length)
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i)
  }
  return new Blob([bytes], { type: mimeType })
}

/**
 * Decodes a base64 string and creates a File object
 * @param base64Data - The base64 encoded string
 * @param filename - The name for the file
 * @param mimeType - The MIME type of the file (default: 'application/pdf')
 * @returns A File object
 */
export function base64ToFile(
  base64Data: string,
  filename: string,
  mimeType: string = 'application/pdf'
): File {
  const blob = base64ToBlob(base64Data, mimeType)
  return new File([blob], filename, { type: mimeType })
}

/**
 * Decodes a base64 string and opens it in a new window
 * @param base64Data - The base64 encoded string
 * @param filename - The name for the file
 * @param mimeType - The MIME type of the file (default: 'application/pdf')
 */
export function openBase64InNewWindow(
  base64Data: string,
  filename: string,
  mimeType: string = 'application/pdf'
): void {
  const file = base64ToFile(base64Data, filename, mimeType)
  const urlFile = window.URL.createObjectURL(file)
  window.open(urlFile)
}
