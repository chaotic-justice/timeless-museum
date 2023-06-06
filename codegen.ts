import type { CodegenConfig } from '@graphql-codegen/cli'

const config: CodegenConfig = {
  overwrite: true,
  // schema: "./generated/schema.graphql",
  schema: 'http://localhost:3000/api/graphql',
  documents: ['pages/**/*.tsx', 'pages/*.tsx', 'library/hooks/*.ts'],
  ignoreNoDocuments: true,
  generates: {
    'library/gql/': {
      preset: 'client',
      plugins: [],
    },
  },
  config: {
    scalars: {
      ID: 'string',
      String: 'string',
      Boolean: 'boolean',
      Int: 'number',
      Float: 'number',
    },
  },
  hooks: { afterAllFileWrite: ['prettier --write'] },
}

export default config
