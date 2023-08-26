import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  // `withAuth` augments your `Request` with the user's token.
  function middleware(req) {
    if (!req.nextauth.token!.admin) {
      const newUrl = new URL('/', req.url)
      return NextResponse.redirect(newUrl)
    }
  }
  // {
  //   callbacks: {
  //     authorized: (obj) => {
  //       return obj.token?.role === "admin"
  //     },
  //   },
  // }
)

export const config = { matcher: ['/upload-image'] }
