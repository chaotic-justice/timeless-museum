import type { CodegenConfig } from "@graphql-codegen/cli"

const config: CodegenConfig = {
  overwrite: true,
  schema: "./generated/schema.graphql",
  documents: ["pages/**/*.tsx", "pages/*.tsx", "components/*.tsx"],
  ignoreNoDocuments: true,
  generates: {
    "lib/gql/": {
      preset: "client",
      plugins: [],
    },
  },
  hooks: { afterAllFileWrite: ["prettier --write"] },
}

export default config
