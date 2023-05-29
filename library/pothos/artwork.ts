import prisma from "../prisma"
<<<<<<< HEAD:library/pothos/artwork.ts
import { TMutationFieldBuilder, TQueryFieldBuilder, builder } from "./builder"
=======
import { TQueryFieldBuilder, builder } from "./builder"
>>>>>>> 1f15e9f (modulized pothos schema part 2):library/pothos/photograph.ts

builder.prismaObject("Artwork", {
  fields: (t) => ({
    id: t.exposeID("id"),
    title: t.exposeString("title"),
    description: t.exposeString("description", { nullable: true }),
    imageUrls: t.exposeStringList("imageUrls"),
    category: t.exposeString("category"),
    createdAt: t.expose("createdAt", {
      type: "Date",
    }),
  }),
})

<<<<<<< HEAD:library/pothos/artwork.ts
export const artworkQueryType = (t: TQueryFieldBuilder) =>
=======
export const photographsQueryType = (t: TQueryFieldBuilder) =>
>>>>>>> 1f15e9f (modulized pothos schema part 2):library/pothos/photograph.ts
  t.prismaField({
    type: "Artwork",
    args: {
      id: t.arg.id({ required: true }),
    },
    nullable: true,
    resolve: async (query, _parent, args, _info) =>
      await prisma.artwork.findUnique({
        ...query,
        where: {
          id: Number(args.id),
        },
      }),
  })

export const artworksQueryType = (t: TQueryFieldBuilder) =>
  t.prismaField({
    type: ["Artwork"],
    resolve: async (query, _parent, _args, _info) =>
      await prisma.artwork.findMany({
        ...query,
        where: {
          NOT: [
            {
              imageUrls: {
                isEmpty: true,
              },
            },
          ],
        },
      }),
  })

export const createArtworkMutationType = (t: TMutationFieldBuilder) =>
  t.prismaField({
    type: "Artwork",
    args: {
      title: t.arg.string({ required: true }),
      description: t.arg.string({ required: false }),
      imageUrls: t.arg.stringList({ required: true }),
      category: t.arg.string({ required: true }),
    },
    resolve: async (query, _parent, args, ctx) => {
      const { title, description, imageUrls, category } = args

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
      if (!imageUrls.length) {
        throw new Error("img urls required")
      }
      return await prisma.artwork.create({
        ...query,
        data: {
          title,
          description,
          imageUrls,
          category,
        },
      })
    },
  })
