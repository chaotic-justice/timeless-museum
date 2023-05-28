import { graphql } from "../gql"

export const publishDraftDocument = graphql(`
  mutation PublishDraft($id: ID!) {
    publishDraft(id: $id) {
      ...PostItem
    }
  }
`)

export const DeletePostDocument = graphql(`
  mutation DeletePost($id: ID!) {
    deletePost(id: $id) {
      ...PostItem
    }
  }
`)

export const getPostDocument = graphql(`
  query GetPostById($id: ID!) {
    post(id: $id) {
      ...PostItem
    }
  }
`)
