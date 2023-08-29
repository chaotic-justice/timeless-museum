import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth'
import { CustomUser, authOptions } from './auth/[...nextauth]'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions)
  const user = session?.user as CustomUser
  // if (user.role !== 'ADMIN') {
  //   return res.status(401).json({ data: null })
  // }
  try {
    const s3Client = new S3Client({
      region: process.env.APP_AWS_REGION,
      credentials: {
        accessKeyId: process.env.APP_AWS_ACCESS_KEY,
        secretAccessKey: process.env.APP_AWS_SECRET_KEY,
      },
    })

    const bucketName = process.env.AWS_S3_BUCKET_NAME
    const fileName = req.query.file as string
    const command = new PutObjectCommand({ Bucket: bucketName, Key: fileName })
    const post = await getSignedUrl(s3Client, command, { expiresIn: 3600 })
    res.status(200).json(post)
  } catch (error) {
    console.error('Error:', error)
    res.status(500).json({ message: 'Internal Server Error' })
  }
}
