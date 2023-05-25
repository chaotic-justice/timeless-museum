import { graphql } from "../gql"

export const createPhotograph = graphql(`
  mutation CreatePhotograph($title: String!, $imageUrl: String!, $category: String!, $description: String) {
    createPhotograph(title: $title, imageUrl: $imageUrl, category: $category, description: $description) {
      title
      createdAt
      imageUrl
      category
      description
      createdAt
    }
  }
`)

export const getPhotographsDocument = graphql(`
  query GetPhotographs {
    getPhotographs {
      id
      title
      description
      category
      createdAt
      imageUrl
    }
  }
`)
