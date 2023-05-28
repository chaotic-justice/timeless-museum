import { writeFileSync } from "fs"
import { lexicographicSortSchema, printSchema } from "graphql"
import path from "path"
import { builder } from "./builder"
import { photographsQueryType } from "./photograph"
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
    photographs: photographsQueryType(t),
    users: usersQueryType(t),
    post: postQueryType(t),
    drafts: draftsQueryType(t),
    filterPosts: filterPostsQueryType(t),
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
  }),
})

export const schema = builder.toSchema()
const schemaAsString = printSchema(lexicographicSortSchema(schema))

writeFileSync(path.resolve("./generated/schema.graphql"), schemaAsString)
