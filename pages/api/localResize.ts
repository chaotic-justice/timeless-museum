import { NextApiRequest, NextApiResponse } from 'next'
import sharp from 'sharp'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    console.log('req.body', req.body)
    const { image } = req.body

    if (!image) {
      return res.status(400).json({ error: 'Image data is required' })
    }

    const resizedImage = await sharp(image).resize({ width: 1200, height: 1350 }).jpeg().toBuffer()

    res.setHeader('Content-Type', 'image/jpeg')
    res.send(resizedImage)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Internal server error' })
  }
}
