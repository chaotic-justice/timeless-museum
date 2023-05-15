/* eslint-disable */
import * as types from "./graphql";
import { TypedDocumentNode as DocumentNode } from "@graphql-typed-document-node/core";

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 */
const documents = {
  "\n  fragment PostItem on Post {\n    id\n    title\n    content\n    published\n    author {\n      id\n      name\n    }\n  }\n":
    types.PostItemFragmentDoc,
  "\n  mutation CreatePhotographMutation($title: String!, $imageUrl: String!, $category: String!, $description: String) {\n    createPhotograph(title: $title, imageUrl: $imageUrl, category: $category, description: $description) {\n      title\n      createdAt\n      imageUrl\n      category\n      description\n      createdAt\n    }\n  }\n":
    types.CreatePhotographMutationDocument,
  "\n  mutation PublishMutation($id: ID!) {\n    publish(id: $id) {\n      ...PostItem\n    }\n  }\n":
    types.PublishMutationDocument,
  "\n  mutation DeleteMutation($id: ID!) {\n    deletePost(id: $id) {\n      ...PostItem\n    }\n  }\n":
    types.DeleteMutationDocument,
  "\n  query GetPostById($id: ID!) {\n    post(id: $id) {\n      ...PostItem\n    }\n  }\n":
    types.GetPostByIdDocument,
  "\n  query GetDrafts {\n    drafts {\n      ...PostItem\n    }\n  }\n":
    types.GetDraftsDocument,
  "\n      query FeedQuery {\n        feed {\n          id\n          title\n          content\n          published\n          author {\n            id\n            name\n          }\n        }\n      }\n    ":
    types.FeedQueryDocument,
  "\n  mutation SignupMutation($name: String, $email: String!) {\n    signupUser(name: $name, email: $email) {\n      id\n      name\n      email\n    }\n  }\n":
    types.SignupMutationDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n  fragment PostItem on Post {\n    id\n    title\n    content\n    published\n    author {\n      id\n      name\n    }\n  }\n"
): (typeof documents)["\n  fragment PostItem on Post {\n    id\n    title\n    content\n    published\n    author {\n      id\n      name\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n  mutation CreatePhotographMutation($title: String!, $imageUrl: String!, $category: String!, $description: String) {\n    createPhotograph(title: $title, imageUrl: $imageUrl, category: $category, description: $description) {\n      title\n      createdAt\n      imageUrl\n      category\n      description\n      createdAt\n    }\n  }\n"
): (typeof documents)["\n  mutation CreatePhotographMutation($title: String!, $imageUrl: String!, $category: String!, $description: String) {\n    createPhotograph(title: $title, imageUrl: $imageUrl, category: $category, description: $description) {\n      title\n      createdAt\n      imageUrl\n      category\n      description\n      createdAt\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n  mutation PublishMutation($id: ID!) {\n    publish(id: $id) {\n      ...PostItem\n    }\n  }\n"
): (typeof documents)["\n  mutation PublishMutation($id: ID!) {\n    publish(id: $id) {\n      ...PostItem\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n  mutation DeleteMutation($id: ID!) {\n    deletePost(id: $id) {\n      ...PostItem\n    }\n  }\n"
): (typeof documents)["\n  mutation DeleteMutation($id: ID!) {\n    deletePost(id: $id) {\n      ...PostItem\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n  query GetPostById($id: ID!) {\n    post(id: $id) {\n      ...PostItem\n    }\n  }\n"
): (typeof documents)["\n  query GetPostById($id: ID!) {\n    post(id: $id) {\n      ...PostItem\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n  query GetDrafts {\n    drafts {\n      ...PostItem\n    }\n  }\n"
): (typeof documents)["\n  query GetDrafts {\n    drafts {\n      ...PostItem\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n      query FeedQuery {\n        feed {\n          id\n          title\n          content\n          published\n          author {\n            id\n            name\n          }\n        }\n      }\n    "
): (typeof documents)["\n      query FeedQuery {\n        feed {\n          id\n          title\n          content\n          published\n          author {\n            id\n            name\n          }\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n  mutation SignupMutation($name: String, $email: String!) {\n    signupUser(name: $name, email: $email) {\n      id\n      name\n      email\n    }\n  }\n"
): (typeof documents)["\n  mutation SignupMutation($name: String, $email: String!) {\n    signupUser(name: $name, email: $email) {\n      id\n      name\n      email\n    }\n  }\n"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> =
  TDocumentNode extends DocumentNode<infer TType, any> ? TType : never;
