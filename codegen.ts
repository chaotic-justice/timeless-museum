import { CodegenConfig } from "@graphql-codegen/cli"

const config: CodegenConfig = {
  schema: "./generated/schema.graphql",
  documents: ["src/**/*.tsx"],
  ignoreNoDocuments: true,
  generates: {
    "./src/gql/": {
      preset: "client",
    },
  },
  config: {
    scalars: {
      UUID: "string",
      DateTime: "Date",
    },
  },
}

export default config
