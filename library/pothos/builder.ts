import SchemaBuilder from '@pothos/core'
import PrismaPlugin from '@pothos/plugin-prisma'
import type PrismaTypes from '@pothos/plugin-prisma/generated'
import prisma from '../prisma'
import { DateResolver } from 'graphql-scalars'

export const builder = new SchemaBuilder<{
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

export type TQueryFieldBuilder = PothosSchemaTypes.QueryFieldBuilder<
  PothosSchemaTypes.ExtendDefaultTypes<{
    Scalars: {
      Date: {
        Input: Date
        Output: Date
      }
    }
    PrismaTypes: PrismaTypes
  }>,
  object
>

export type TMutationFieldBuilder = PothosSchemaTypes.MutationFieldBuilder<
  PothosSchemaTypes.ExtendDefaultTypes<{
    Scalars: {
      Date: {
        Input: Date
        Output: Date
      }
    }
    PrismaTypes: PrismaTypes
  }>,
  object
>

builder.addScalarType('Date', DateResolver, {})
