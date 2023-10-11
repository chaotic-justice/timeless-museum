import { GetObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { NextApiRequest, NextApiResponse } from 'next'
import sharp from 'sharp'
import { Readable } from 'stream'

const s3Client = new S3Client({
  region: process.env.APP_AWS_REGION,
  credentials: {
    accessKeyId: process.env.APP_AWS_ACCESS_KEY,
    secretAccessKey: process.env.APP_AWS_SECRET_KEY,
  },
})

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { filePath } = req.query

    // Fetch original image from S3
    const getObjectCommand = new GetObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: filePath as string,
    })
    const originalImage = await s3Client.send(getObjectCommand)
    if (!originalImage.Body) {
      return res.status(401).json({ message: 'Error locating image' })
    }

    const originalImageBuffer = await streamToBuffer(originalImage.Body as Readable)
    const resizedImage = await sharp(originalImageBuffer).resize(1350).toBuffer()

    // Upload the resized image back to S3
    const putObjectCommand = new PutObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: filePath as string,
      Body: resizedImage,
      ContentType: originalImage.ContentType,
    })
    await s3Client.send(putObjectCommand)

    res.status(200).json({ message: 'Image resized and uploaded successfully' })
  } catch (error) {
    console.error('Error resizing image:', error)
    res.status(500).json({ message: 'Error resizing image' })
  }
}

async function streamToBuffer(readableStream: Readable): Promise<Buffer> {
  const chunks: Buffer[] = []
  return new Promise((resolve, reject) => {
    readableStream.on('data', chunk => {
      chunks.push(chunk)
    })
    readableStream.on('end', () => {
      resolve(Buffer.concat(chunks))
    })
    readableStream.on('error', reject)
  })
}
