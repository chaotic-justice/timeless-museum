export const generateFileName = (extension: string, fileId: string) => {
  const filename = `${fileId}.${extension}`
  return filename
}
