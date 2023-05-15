import { graphql } from "../gql"

export const imageUploadDocumnet = graphql(`
  mutation ReadFile($file: File!) {
    readTextFile(file: $file)
  }
`)
