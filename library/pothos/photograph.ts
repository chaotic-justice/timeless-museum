import prisma from "../prisma"
import { TQueryFieldBuilder, builder } from "./builder"

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

export const photographsQueryType = (t: TQueryFieldBuilder) =>
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
