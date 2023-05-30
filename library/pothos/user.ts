import prisma from "../prisma"
import { TMutationFieldBuilder, TQueryFieldBuilder, builder } from "./builder"

export enum Role {
  USER = "user",
  ADMIN = "admin",
}

builder.enumType(Role, {
  name: "Role",
})

builder.prismaObject("User", {
  fields: (t) => ({
    id: t.exposeID("id"),
    email: t.exposeString("email", { nullable: true }),
    name: t.exposeString("name", { nullable: true }),
    role: t.field({
      type: Role,
      resolve: (parent) => (parent.role === "ADMIN" ? Role.ADMIN : Role.USER),
    }),
    posts: t.relation("posts"),
  }),
})

export const usersQueryType = (t: TQueryFieldBuilder) =>
  t.prismaField({
    type: ["User"],
    resolve: async (query) =>
      prisma.user.findMany({
        ...query,
        where: {
          email: {
            not: "",
          },
        },
      }),
  })

export const signUpMutationType = (t: TMutationFieldBuilder) =>
  t.prismaField({
    type: "User",
    args: {
      name: t.arg.string({ required: false }),
      email: t.arg.string({ required: true }),
    },
    resolve: async (query, _parent, args) =>
      await prisma.user.create({
        ...query,
        data: {
          email: args.email,
          name: args.name,
        },
      }),
  })
