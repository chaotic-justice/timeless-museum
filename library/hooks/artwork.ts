import request from "graphql-request"
import { graphql } from "../gql"
import { MutationCreateArtworkArgs } from "../gql/graphql"

const createArtworkDocument = graphql(`
  mutation CreateArtwork($title: String!, $imageUrls: [String!]!, $category: String!, $description: String) {
    createArtwork(title: $title, imageUrls: $imageUrls, category: $category, description: $description) {
      title
      createdAt
      imageUrls
      category
      description
      createdAt
    }
  }
`)

const getArtworksDocument = graphql(`
  query GetArtworks {
    getArtworks {
      id
      title
      description
      category
      createdAt
      imageUrls
    }
  }
`)

const getArtworkDocument = graphql(`
  query GetArtworkById($id: ID!) {
    getArtworkById(id: $id) {
      id
      title
      description
      category
      imageUrls
      createdAt
    }
  }
`)

export const getArtworkById = async (artworkId: string) =>
  await request(process.env.NEXT_PUBLIC_GQL_API, getArtworkDocument, { id: artworkId })

export const getArtworks = async () => await request(process.env.NEXT_PUBLIC_GQL_API, getArtworksDocument)

export const createArtwork = async (args: MutationCreateArtworkArgs) =>
  await request(process.env.NEXT_PUBLIC_GQL_API, createArtworkDocument, {
    ...args,
  })
