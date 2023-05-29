import { writeFileSync } from "fs"
import { lexicographicSortSchema, printSchema } from "graphql"
import path from "path"
<<<<<<< HEAD
import { artworkQueryType, artworksQueryType, createArtworkMutationType } from "./artwork"
import { builder } from "./builder"
=======
import { builder } from "./builder"
import { photographsQueryType } from "./photograph"
>>>>>>> 1f15e9f (modulized pothos schema part 2)
import {
  createDraftMutationType,
  deletePostMutationType,
  draftsQueryType,
  filterPostsQueryType,
  postQueryType,
  publishDraftMutationType,
} from "./post"
import { signUpMutationType, usersQueryType } from "./user"

builder.queryType({
  fields: (t) => ({
<<<<<<< HEAD
    getArtworkById: artworkQueryType(t),
    getArtworks: artworksQueryType(t),
    getUsers: usersQueryType(t),
    getPostById: postQueryType(t),
    getDrafts: draftsQueryType(t),
    filterPostsBy: filterPostsQueryType(t),
=======
    photographs: photographsQueryType(t),
    users: usersQueryType(t),
    post: postQueryType(t),
    drafts: draftsQueryType(t),
    filterPosts: filterPostsQueryType(t),
>>>>>>> 1f15e9f (modulized pothos schema part 2)
  }),
})

builder.mutationType({
  fields: (t) => ({
    // user
    signUp: signUpMutationType(t),
    // post
    createDraft: createDraftMutationType(t),
    deletePost: deletePostMutationType(t),
    publishDraft: publishDraftMutationType(t),
<<<<<<< HEAD
    // art??
    createArtwork: createArtworkMutationType(t),
=======
>>>>>>> 1f15e9f (modulized pothos schema part 2)
  }),
})

export const schema = builder.toSchema()
const schemaAsString = printSchema(lexicographicSortSchema(schema))

writeFileSync(path.resolve("./generated/schema.graphql"), schemaAsString)
