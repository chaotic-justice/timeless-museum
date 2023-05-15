/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from "@graphql-typed-document-node/core";
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>;
};
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>;
};
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  File: any;
};

export type Mutation = {
  __typename?: "Mutation";
  createDraft: Post;
  deletePost: Post;
  publish: Post;
  readTextFile: Scalars["String"];
  signupUser: User;
};

export type MutationCreateDraftArgs = {
  authorEmail: Scalars["String"];
  content?: InputMaybe<Scalars["String"]>;
  title: Scalars["String"];
};

export type MutationDeletePostArgs = {
  id: Scalars["ID"];
};

export type MutationPublishArgs = {
  id: Scalars["ID"];
};

export type MutationReadTextFileArgs = {
  file: Scalars["File"];
};

export type MutationSignupUserArgs = {
  email: Scalars["String"];
  name?: InputMaybe<Scalars["String"]>;
};

export type Post = {
  __typename?: "Post";
  author: User;
  content?: Maybe<Scalars["String"]>;
  id: Scalars["ID"];
  published: Scalars["Boolean"];
  title: Scalars["String"];
};

export type Query = {
  __typename?: "Query";
  drafts: Array<Post>;
  feed: Array<Post>;
  filterPosts: Array<Post>;
  post?: Maybe<Post>;
};

export type QueryFilterPostsArgs = {
  searchString?: InputMaybe<Scalars["String"]>;
};

export type QueryPostArgs = {
  id: Scalars["ID"];
};

export type User = {
  __typename?: "User";
  email: Scalars["String"];
  id: Scalars["ID"];
  name?: Maybe<Scalars["String"]>;
  posts: Array<Post>;
};

export type PostItemFragment = {
  __typename?: "Post";
  id: string;
  title: string;
  content?: string | null;
  published: boolean;
  author: { __typename?: "User"; id: string; name?: string | null };
} & { " $fragmentName"?: "PostItemFragment" };

export type ReadFileMutationVariables = Exact<{
  file: Scalars["File"];
}>;

export type ReadFileMutation = {
  __typename?: "Mutation";
  readTextFile: string;
};

export type PublishMutationMutationVariables = Exact<{
  id: Scalars["ID"];
}>;

export type PublishMutationMutation = {
  __typename?: "Mutation";
  publish: { __typename?: "Post" } & {
    " $fragmentRefs"?: { PostItemFragment: PostItemFragment };
  };
};

export type DeleteMutationMutationVariables = Exact<{
  id: Scalars["ID"];
}>;

export type DeleteMutationMutation = {
  __typename?: "Mutation";
  deletePost: { __typename?: "Post" } & {
    " $fragmentRefs"?: { PostItemFragment: PostItemFragment };
  };
};

export type GetPostByIdQueryVariables = Exact<{
  id: Scalars["ID"];
}>;

export type GetPostByIdQuery = {
  __typename?: "Query";
  post?:
    | ({ __typename?: "Post" } & {
        " $fragmentRefs"?: { PostItemFragment: PostItemFragment };
      })
    | null;
};

export type GetDraftsQueryVariables = Exact<{ [key: string]: never }>;

export type GetDraftsQuery = {
  __typename?: "Query";
  drafts: Array<
    { __typename?: "Post" } & {
      " $fragmentRefs"?: { PostItemFragment: PostItemFragment };
    }
  >;
};

export type FeedQueryQueryVariables = Exact<{ [key: string]: never }>;

export type FeedQueryQuery = {
  __typename?: "Query";
  feed: Array<{
    __typename?: "Post";
    id: string;
    title: string;
    content?: string | null;
    published: boolean;
    author: { __typename?: "User"; id: string; name?: string | null };
  }>;
};

export type SignupMutationMutationVariables = Exact<{
  name?: InputMaybe<Scalars["String"]>;
  email: Scalars["String"];
}>;

export type SignupMutationMutation = {
  __typename?: "Mutation";
  signupUser: {
    __typename?: "User";
    id: string;
    name?: string | null;
    email: string;
  };
};

export const PostItemFragmentDoc = {
  kind: "Document",
  definitions: [
    {
      kind: "FragmentDefinition",
      name: { kind: "Name", value: "PostItem" },
      typeCondition: {
        kind: "NamedType",
        name: { kind: "Name", value: "Post" },
      },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          { kind: "Field", name: { kind: "Name", value: "id" } },
          { kind: "Field", name: { kind: "Name", value: "title" } },
          { kind: "Field", name: { kind: "Name", value: "content" } },
          { kind: "Field", name: { kind: "Name", value: "published" } },
          {
            kind: "Field",
            name: { kind: "Name", value: "author" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "name" } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<PostItemFragment, unknown>;
export const ReadFileDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "ReadFile" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "file" } },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "File" } },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "readTextFile" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "file" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "file" },
                },
              },
            ],
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<ReadFileMutation, ReadFileMutationVariables>;
export const PublishMutationDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "PublishMutation" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "id" } },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "ID" } },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "publish" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "id" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "id" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "FragmentSpread",
                  name: { kind: "Name", value: "PostItem" },
                },
              ],
            },
          },
        ],
      },
    },
    {
      kind: "FragmentDefinition",
      name: { kind: "Name", value: "PostItem" },
      typeCondition: {
        kind: "NamedType",
        name: { kind: "Name", value: "Post" },
      },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          { kind: "Field", name: { kind: "Name", value: "id" } },
          { kind: "Field", name: { kind: "Name", value: "title" } },
          { kind: "Field", name: { kind: "Name", value: "content" } },
          { kind: "Field", name: { kind: "Name", value: "published" } },
          {
            kind: "Field",
            name: { kind: "Name", value: "author" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "name" } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  PublishMutationMutation,
  PublishMutationMutationVariables
>;
export const DeleteMutationDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "DeleteMutation" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "id" } },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "ID" } },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "deletePost" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "id" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "id" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "FragmentSpread",
                  name: { kind: "Name", value: "PostItem" },
                },
              ],
            },
          },
        ],
      },
    },
    {
      kind: "FragmentDefinition",
      name: { kind: "Name", value: "PostItem" },
      typeCondition: {
        kind: "NamedType",
        name: { kind: "Name", value: "Post" },
      },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          { kind: "Field", name: { kind: "Name", value: "id" } },
          { kind: "Field", name: { kind: "Name", value: "title" } },
          { kind: "Field", name: { kind: "Name", value: "content" } },
          { kind: "Field", name: { kind: "Name", value: "published" } },
          {
            kind: "Field",
            name: { kind: "Name", value: "author" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "name" } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  DeleteMutationMutation,
  DeleteMutationMutationVariables
>;
export const GetPostByIdDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "GetPostById" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "id" } },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "ID" } },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "post" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "id" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "id" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "FragmentSpread",
                  name: { kind: "Name", value: "PostItem" },
                },
              ],
            },
          },
        ],
      },
    },
    {
      kind: "FragmentDefinition",
      name: { kind: "Name", value: "PostItem" },
      typeCondition: {
        kind: "NamedType",
        name: { kind: "Name", value: "Post" },
      },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          { kind: "Field", name: { kind: "Name", value: "id" } },
          { kind: "Field", name: { kind: "Name", value: "title" } },
          { kind: "Field", name: { kind: "Name", value: "content" } },
          { kind: "Field", name: { kind: "Name", value: "published" } },
          {
            kind: "Field",
            name: { kind: "Name", value: "author" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "name" } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<GetPostByIdQuery, GetPostByIdQueryVariables>;
export const GetDraftsDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "GetDrafts" },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "drafts" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "FragmentSpread",
                  name: { kind: "Name", value: "PostItem" },
                },
              ],
            },
          },
        ],
      },
    },
    {
      kind: "FragmentDefinition",
      name: { kind: "Name", value: "PostItem" },
      typeCondition: {
        kind: "NamedType",
        name: { kind: "Name", value: "Post" },
      },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          { kind: "Field", name: { kind: "Name", value: "id" } },
          { kind: "Field", name: { kind: "Name", value: "title" } },
          { kind: "Field", name: { kind: "Name", value: "content" } },
          { kind: "Field", name: { kind: "Name", value: "published" } },
          {
            kind: "Field",
            name: { kind: "Name", value: "author" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "name" } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<GetDraftsQuery, GetDraftsQueryVariables>;
export const FeedQueryDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "FeedQuery" },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "feed" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "title" } },
                { kind: "Field", name: { kind: "Name", value: "content" } },
                { kind: "Field", name: { kind: "Name", value: "published" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "author" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "id" } },
                      { kind: "Field", name: { kind: "Name", value: "name" } },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<FeedQueryQuery, FeedQueryQueryVariables>;
export const SignupMutationDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "SignupMutation" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "name" } },
          type: { kind: "NamedType", name: { kind: "Name", value: "String" } },
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "email" },
          },
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: { kind: "Name", value: "String" },
            },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "signupUser" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "name" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "name" },
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "email" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "email" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "name" } },
                { kind: "Field", name: { kind: "Name", value: "email" } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  SignupMutationMutation,
  SignupMutationMutationVariables
>;
