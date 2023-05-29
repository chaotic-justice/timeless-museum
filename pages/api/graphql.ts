import { createYoga } from "graphql-yoga"

import type { NextApiRequest, NextApiResponse } from "next"

import { schema } from "../../library/pothos/schema"

export default createYoga<{
  req: NextApiRequest
  res: NextApiResponse
}>({
  // cors: (request) => {
  //   const requestOrigin = request.headers.get("origin") || "http://localhost:3000"
  //   return {
  //     origin: requestOrigin,
  //     credentials: true,
  //     allowedHeaders: ["Content-Type, x-requested-with"],
  //     methods: ["POST"],
  //   }
  // },
  schema,
  graphqlEndpoint: "/api/graphql",
  // TODO: add auth context
  // https://the-guild.dev/graphql/yoga-server/tutorial/advanced/01-authentication
  // OR => gql-shielf
})

export const config = {
  api: {
    bodyParser: false,
  },
}
