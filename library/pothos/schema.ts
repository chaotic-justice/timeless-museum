import { artworkQueryType, artworksQueryType, createArtworkMutationType } from './artwork'
import { builder } from './builder'
import {
  createDraftMutationType,
  deletePostMutationType,
  draftsQueryType,
  filterPostsQueryType,
  postQueryType,
  publishDraftMutationType,
} from './post'
import { signUpMutationType, usersQueryType } from './user'

builder.queryType({
  fields: t => ({
    getArtworkById: artworkQueryType(t),
    getArtworks: artworksQueryType(t),
    getUsers: usersQueryType(t),
    getPostById: postQueryType(t),
    getDrafts: draftsQueryType(t),
    filterPostsBy: filterPostsQueryType(t),
  }),
})

builder.mutationType({
  fields: t => ({
    // user
    signUp: signUpMutationType(t),
    // post
    createDraft: createDraftMutationType(t),
    deletePost: deletePostMutationType(t),
    publishDraft: publishDraftMutationType(t),
    // art??
    createArtwork: createArtworkMutationType(t),
  }),
})

export const schema = builder.toSchema()
// const schemaAsString = printSchema(lexicographicSortSchema(schema))

// writeFileSync(path.resolve("/tmp/generated/schema.graphql"), schemaAsString)
