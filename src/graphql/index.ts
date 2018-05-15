import { GraphQLSchema, GraphQLObjectType } from 'graphql'

import { UserSchema } from './types/user'
import { ConversationSchema } from './types/conversation'
import { MessageSchema } from './types/message'

export const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Query',
    fields: () => ({
      ...UserSchema.query,
      ...ConversationSchema.query,
      ...MessageSchema.query
    })
  }),
  mutation: new GraphQLObjectType({
    name: 'Mutation',
    fields: () => ({
      ...UserSchema.mutation,
      ...ConversationSchema.mutation,
      ...MessageSchema.mutation
    })
  }),
  subscription: new GraphQLObjectType({
    name: 'Subscription',
    fields: () => ({
      ...UserSchema.subscription,
      ...ConversationSchema.subscription,
      ...MessageSchema.subscription
    })
  }),
  types: [
    ...UserSchema.types,
    ...ConversationSchema.types,
    ...MessageSchema.types
  ]
})
