import prisma from "../prisma"
import { TField, builder } from "./builder"

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

export const usersQueryType = (t: TField) =>
  t.prismaField({
    type: ["User"],
    resolve: async (query, _parent, _args, _info) =>
      prisma.user.findMany({
        where: {
          email: {
            not: "",
          },
        },
      }),
  })
