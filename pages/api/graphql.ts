import SchemaBuilder from "@pothos/core"
import PrismaPlugin from "@pothos/plugin-prisma"
import { DateResolver } from "graphql-scalars"
import { createYoga } from "graphql-yoga"

import type PrismaTypes from "@pothos/plugin-prisma/generated"
import type { NextApiRequest, NextApiResponse } from "next"

import { writeFileSync } from "fs"
import { lexicographicSortSchema, printSchema } from "graphql"
import path from "path"
import prisma from "../../lib/prisma"

const builder = new SchemaBuilder<{
  Scalars: {
    Date: { Input: Date; Output: Date }
  }
  PrismaTypes: PrismaTypes
}>({
  plugins: [PrismaPlugin],
  prisma: {
    client: prisma,
  },
})

builder.addScalarType("Date", DateResolver, {})

builder.queryType({})

builder.mutationType({})

builder.prismaObject("User", {
  fields: (t) => ({
    id: t.exposeID("id"),
    email: t.exposeString("email", { nullable: true }),
    name: t.exposeString("name", { nullable: true }),
    posts: t.relation("posts"),
  }),
})

builder.prismaObject("Post", {
  fields: (t) => ({
    id: t.exposeID("id"),
    title: t.exposeString("title"),
    content: t.exposeString("content", { nullable: true }),
    published: t.exposeBoolean("published"),
    author: t.relation("author"),
  }),
})

builder.prismaObject("Photograph", {
  fields: (t) => ({
    id: t.exposeID("id"),
    title: t.exposeString("title"),
    description: t.exposeString("description", { nullable: true }),
    imageUrl: t.exposeString("imageUrl"),
    category: t.exposeString("category"),
    createdAt: t.expose("createdAt", {
      type: "Date",
    }),
  }),
})

builder.queryField("feed", (t) =>
  t.prismaField({
    type: ["Post"],
    resolve: async (query, _parent, _args, _info) =>
      prisma.post.findMany({
        ...query,
        where: { published: true },
      }),
  })
)

builder.queryField("getPhotographs", (t) =>
  t.prismaField({
    type: ["Photograph"],
    resolve: async (query, _parent, _args, _info) =>
      prisma.photograph.findMany({
        ...query,
        where: {
          imageUrl: {
            not: "",
          },
        },
      }),
  })
)

builder.queryField("post", (t) =>
  t.prismaField({
    type: "Post",
    args: {
      id: t.arg.id({ required: true }),
    },
    nullable: true,
    resolve: async (query, _parent, args, _info) =>
      prisma.post.findUnique({
        ...query,
        where: {
          id: Number(args.id),
        },
      }),
  })
)

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

builder.mutationField("createPhotograph", (t) =>
  t.prismaField({
    type: "Photograph",
    args: {
      title: t.arg.string({ required: true }),
      description: t.arg.string({ required: false }),
      imageUrl: t.arg.string({ required: true }),
      category: t.arg.string({ required: true }),
    },
    resolve: async (query, _parent, args, ctx) => {
      const { title, description, imageUrl, category } = args

      // if (!(await ctx).user) {
      //   throw new Error("You have to be logged in to perform this action")
      // }

      // const user = await prisma.user.findUnique({
      //   where: {
      //     email: (await ctx).user?.email,
      //   }
      // })

      // if (!user || user.role !== "ADMIN") {
      //   throw new Error("You don have permission ot perform this action")
      // }
      return await prisma.photograph.create({
        ...query,
        data: {
          title,
          description,
          imageUrl,
          category,
        },
      })
    },
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

const schema = builder.toSchema()
const schemaAsString = printSchema(lexicographicSortSchema(schema))

writeFileSync(path.resolve("./generated/schema.graphql"), schemaAsString)

export default createYoga<{
  req: NextApiRequest
  res: NextApiResponse
}>({
  // cors: (request) => {
  //   const requestOrigin = request.headers.get("origin") || "http://localhost:3000"
  //   return {
  //     origin: requestOrigin,
  //     credentials: true,
  //     allowedHeaders: ["Content-Type, x-requested-with"],
  //     methods: ["POST"],
  //   }
  // },
  schema,
  graphqlEndpoint: "/api/graphql",
})

export const config = {
  api: {
    bodyParser: false,
  },
}
