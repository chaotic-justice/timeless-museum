import prisma from "../prisma"
import { TMutationFieldBuilder, TQueryFieldBuilder, builder } from "./builder"

builder.prismaObject("Post", {
  fields: (t) => ({
    id: t.exposeID("id"),
    title: t.exposeString("title"),
    content: t.exposeString("content", { nullable: true }),
    published: t.exposeBoolean("published"),
    author: t.relation("author"),
  }),
})

/* query types */

export const postQueryType = (t: TQueryFieldBuilder) =>
  t.prismaField({
    type: "Post",
    args: {
      id: t.arg.id({ required: true }),
    },
    nullable: true,
    resolve: async (query, _parent, args) =>
      await prisma.post.findUnique({
        ...query,
        where: {
          id: Number(args.id),
        },
      }),
  })

export const draftsQueryType = (t: TQueryFieldBuilder) =>
  t.prismaField({
    type: ["Post"],
    resolve: async (query) =>
      await prisma.post.findMany({
        ...query,
        where: { published: false },
      }),
  })

export const filterPostsQueryType = (t: TQueryFieldBuilder) =>
  t.prismaField({
    type: ["Post"],
    args: {
      searchString: t.arg.string({ required: false }),
    },
    resolve: async (query, _parent, args) => {
      const or = args.searchString
        ? {
            OR: [{ title: { contains: args.searchString } }, { content: { contains: args.searchString } }],
          }
        : {}
      return await prisma.post.findMany({
        ...query,
        where: { ...or },
      })
    },
  })

/* mutation types */

export const createDraftMutationType = (t: TMutationFieldBuilder) =>
  t.prismaField({
    type: "Post",
    args: {
      title: t.arg.string({ required: true }),
      content: t.arg.string(),
      authorEmail: t.arg.string({ required: true }),
    },
    resolve: async (query, _parent, args) =>
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

export const deletePostMutationType = (t: TMutationFieldBuilder) =>
  t.prismaField({
    type: "Post",
    args: {
      id: t.arg.id({ required: true }),
    },
    resolve: async (query, _parent, args) =>
      await prisma.post.delete({
        ...query,
        where: {
          id: Number(args.id),
        },
      }),
  })

export const publishDraftMutationType = (t: TMutationFieldBuilder) =>
  t.prismaField({
    type: "Post",
    args: {
      id: t.arg.id({ required: true }),
    },
    resolve: async (query, _parent, args) =>
      await prisma.post.update({
        ...query,
        where: {
          id: Number(args.id),
        },
        data: {
          published: true,
        },
      }),
  })
