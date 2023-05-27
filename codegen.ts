import type { CodegenConfig } from "@graphql-codegen/cli"

const config: CodegenConfig = {
  overwrite: true,
  schema: "./generated/schema.graphql",
  documents: ["pages/**/*.tsx", "pages/*.tsx", "components/*.tsx", "library/documents/*.ts"],
  ignoreNoDocuments: true,
  generates: {
    "library/gql/": {
      preset: "client",
      plugins: [],
    },
  },
  config: {
    scalars: {
      ID: "string",
      String: "string",
      Boolean: "boolean",
      Int: "number",
      Float: "number",
    },
  },
  hooks: { afterAllFileWrite: ["prettier --write"] },
}

export default config
