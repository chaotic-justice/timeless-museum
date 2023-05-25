import { graphql } from "../gql"

export const publishDocument = graphql(`
  mutation PublishMutation($id: ID!) {
    publish(id: $id) {
      ...PostItem
    }
  }
`)

export const DeleteMutation = graphql(`
  mutation DeleteMutation($id: ID!) {
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
