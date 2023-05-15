import { graphql } from "../gql"

export const createPhotograph = graphql(`
  mutation CreatePhotographMutation($title: String!, $imageUrl: String!, $category: String!, $description: String) {
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