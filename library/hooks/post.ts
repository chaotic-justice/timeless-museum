import request from "graphql-request"
import { graphql } from "../gql"

export const PostFragment = graphql(`
  fragment PostItem on Post {
    id
    title
    content
    published
    author {
      id
      name
    }
  }
`)

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

const getPostDocument = graphql(`
  query GetPostById($id: ID!) {
    getPostById(id: $id) {
      ...PostItem
    }
  }
`)

const draftsQueryDocument = graphql(`
  query GetDrafts {
    getDrafts {
      ...PostItem
    }
  }
`)

export const getPostById = async (postId: string) =>
  await request(process.env.NEXT_PUBLIC_GQL_API as string, getPostDocument, { id: postId })

export const getDrafts = async () => await request(process.env.NEXT_PUBLIC_GQL_API as string, draftsQueryDocument)
