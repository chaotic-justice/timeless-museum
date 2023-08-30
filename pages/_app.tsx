import { Hydrate, QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { SessionProvider, useSession } from 'next-auth/react'
import type { AppProps } from 'next/app'
import { useState } from 'react'
import { isDevEnvironment } from '../library/utils'
import '../styles/index.css'

function MyApp({ Component, pageProps: { ...pageProps } }: AppProps) {
  const [queryClient] = useState(() => new QueryClient())
  return (
    <QueryClientProvider client={queryClient}>
      <Hydrate state={pageProps.dehydratedState}>
        <SessionProvider session={pageProps.session}>
          {Component.auth ? (
            <Auth>
              <Component {...pageProps} />
            </Auth>
          ) : (
            <Component {...pageProps} />
          )}
        </SessionProvider>
      </Hydrate>
      {isDevEnvironment && <ReactQueryDevtools />}
    </QueryClientProvider>
  )
}

const Auth = ({ children }: { children: React.ReactNode }) => {
  // if `{ required: true }` is supplied, `status` can only be "loading" or "authenticated"
  const { status, data } = useSession({ required: true })
  const user = data?.user
  if (status === 'loading') {
    return <div>Loading...</div>
  }
  return children
}

export default MyApp
