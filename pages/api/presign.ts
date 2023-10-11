import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth'
import { authOptions } from './auth/[...nextauth]'

interface ResponseType {
  url: string | null
  authorized: boolean
  message?: string
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseType>) {
  const session = await getServerSession(req, res, authOptions)
  const user = session?.user
  if (user?.role !== 'ADMIN') {
    return res.status(401).json({ url: null, authorized: false })
  }
  try {
    const s3Client = new S3Client({
      region: process.env.APP_AWS_REGION,
      credentials: {
        accessKeyId: process.env.APP_AWS_ACCESS_KEY,
        secretAccessKey: process.env.APP_AWS_SECRET_KEY,
      },
    })

    const bucketName = process.env.AWS_S3_BUCKET_NAME
    const filePath = req.query.filePath as string
    const command = new PutObjectCommand({ Bucket: bucketName, Key: filePath })
    const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 })
    res.status(200).json({ url, authorized: true })
  } catch (error) {
    console.error('Error:', error)
    res.status(500).json({ url: null, authorized: false, message: 'Internal Server Error' })
  }
}
