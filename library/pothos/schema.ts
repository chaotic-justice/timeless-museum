import { writeFileSync } from "fs"
import { lexicographicSortSchema, printSchema } from "graphql"
import path from "path"
import prisma from "../prisma"
import { builder } from "./builder"
import { photographsQueryType } from "./photograph"
import { usersQueryType } from "./user"
import { postQueryType } from "./post"

builder.queryType({
  fields: (t) => ({
    photographs: photographsQueryType(t),
    users: usersQueryType(t),
    post: postQueryType(t),
  }),
})

builder.mutationType({})

builder.queryField("drafts", (t) =>
  t.prismaField({
    type: ["Post"],
    resolve: async (query, _parent, _args, _info) =>
      prisma.post.findMany({
        ...query,
        where: { published: false },
      }),
  })
)

builder.queryField("filterPosts", (t) =>
  t.prismaField({
    type: ["Post"],
    args: {
      searchString: t.arg.string({ required: false }),
    },
    resolve: async (query, _parent, args, _info) => {
      const or = args.searchString
        ? {
            OR: [{ title: { contains: args.searchString } }, { content: { contains: args.searchString } }],
          }
        : {}
      return prisma.post.findMany({
        ...query,
        where: { ...or },
      })
    },
  })
)

builder.mutationField("signupUser", (t) =>
  t.prismaField({
    type: "User",
    args: {
      name: t.arg.string({ required: false }),
      email: t.arg.string({ required: true }),
    },
    resolve: async (query, _parent, args, _info) =>
      prisma.user.create({
        ...query,
        data: {
          email: args.email,
          name: args.name,
        },
      }),
  })
)

builder.mutationField("deletePost", (t) =>
  t.prismaField({
    type: "Post",
    args: {
      id: t.arg.id({ required: true }),
    },
    resolve: async (query, _parent, args, _info) =>
      prisma.post.delete({
        ...query,
        where: {
          id: Number(args.id),
        },
      }),
  })
)

builder.mutationField("publish", (t) =>
  t.prismaField({
    type: "Post",
    args: {
      id: t.arg.id({ required: true }),
    },
    resolve: async (query, _parent, args, _info) =>
      prisma.post.update({
        ...query,
        where: {
          id: Number(args.id),
        },
        data: {
          published: true,
        },
      }),
  })
)

builder.mutationField("createDraft", (t) =>
  t.prismaField({
    type: "Post",
    args: {
      title: t.arg.string({ required: true }),
      content: t.arg.string(),
      authorEmail: t.arg.string({ required: true }),
    },
    resolve: async (query, _parent, args, _info) =>
      prisma.post.create({
        ...query,
        data: {
          title: args.title,
          content: args.content,
          author: {
            connect: { email: args.authorEmail },
          },
        },
      }),
  })
)

export const schema = builder.toSchema()
const schemaAsString = printSchema(lexicographicSortSchema(schema))

writeFileSync(path.resolve("./generated/schema.graphql"), schemaAsString)
