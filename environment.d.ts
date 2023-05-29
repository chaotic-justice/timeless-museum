declare namespace NodeJS {
  export interface ProcessEnv {
    readonly DATABASE_URL: string
    readonly APP_AWS_ACCESS_KEY: string
    readonly APP_AWS_SECRET_KEY: string
    readonly APP_AWS_REGION: string
    readonly AWS_S3_BUCKET_NAME: string
    readonly NEXT_PUBLIC_AWS_S3_BUCKET_NAME: string

    readonly GOOGLE_CLIENT_ID: string
    readonly GOOGLE_CLIENT_SECRET: string

    readonly NEXTAUTH_SECRET: string
    readonly NEXTAUTH_URL: string
    readonly NEXT_PUBLIC_GQL_API: string
  }
}
