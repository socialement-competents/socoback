import { GraphQLSchema, GraphQLObjectType } from 'graphql'

import { UserSchema } from './user'

export const graphqlSchema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Query',
    fields: () => ({ ...UserSchema.query })
  }),
  mutation: new GraphQLObjectType({
    name: 'Mutation',
    fields: () => ({ ...UserSchema.mutation })
  }),
  types: [...UserSchema.types]
})
