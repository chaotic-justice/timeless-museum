import aws from "aws-sdk"
import type { NextApiRequest, NextApiResponse } from "next"
import { getToken } from "next-auth/jwt"

// migrate this to v3
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const token = await getToken({ req })
  if (!token || !token.admin) {
    console.log("JSON Web Token", JSON.stringify(token, null, 2))
    console.log("admin procedure")
    return res.status(401).json({
      data: null,
    })
  }
  try {
    // 1.
    const s3 = new aws.S3({
      accessKeyId: process.env.APP_AWS_ACCESS_KEY,
      secretAccessKey: process.env.APP_AWS_SECRET_KEY,
      region: process.env.APP_AWS_REGION,
    })

    // 2.
    aws.config.update({
      accessKeyId: process.env.APP_AWS_ACCESS_KEY,
      secretAccessKey: process.env.APP_AWS_SECRET_KEY,
      region: process.env.APP_AWS_REGION,
      signatureVersion: "v4",
    })

    // 3.
    const post = await s3.createPresignedPost({
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Fields: {
        key: req.query.file,
      },
      Expires: 600, // seconds
      Conditions: [
        ["content-length-range", 0, 5048576], // up to 1 MB
      ],
    })

    // 4.
    return res.status(200).json(post)
  } catch (error) {
    console.log(error)
  }
}
