import { createYoga } from 'graphql-yoga'

import type { NextApiRequest, NextApiResponse } from 'next'

import { schema } from '../../library/pothos/schema'

export default createYoga<{
  req: NextApiRequest
  res: NextApiResponse
}>({
  schema,
  graphqlEndpoint: '/api/graphql',
  // TODO: add auth context
  // https://the-guild.dev/graphql/yoga-server/tutorial/advanced/01-authentication
  // OR => gql-shielf
})

export const config = {
  api: {
    bodyParser: false,
  },
}
