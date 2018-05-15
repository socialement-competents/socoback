import {
  GraphQLObjectType,
  GraphQLList,
  GraphQLNonNull,
  GraphQLString,
  GraphQLInt,
  GraphQLBoolean
} from 'graphql'
import { userType } from './user'
import { getAll, getById, create } from '../controllers/conversation.ctrl'
import { messageType } from './message'

export const conversationType = new GraphQLObjectType({
  name: 'Conversation',
  description: 'Conversation type',
  fields: () => ({
    _id: {
      type: GraphQLString,
      description: 'The id'
    },
    isHandled: {
      type: GraphQLBoolean,
      description: 'is the conversation handled by operator'
    },
    user: {
      type: userType,
      description: 'The user who started the conversation'
    },
    operator: {
      type: userType,
      description: 'The operator'
    },
    messages: {
      type: new GraphQLList(messageType),
      description: 'Messages of conversations'
    }
  })
})

const query = {
  conversations: {
    type: new GraphQLList(conversationType),
    args: {
      limit: {
        description: 'limit items in the results',
        type: GraphQLInt
      }
    },
    resolve: (root, { limit }) => getAll(limit)
  },
  conversationById: {
    type: conversationType,
    args: {
      id: {
        description: 'find by id',
        type: GraphQLString
      }
    },
    resolve: (root, { id }) => getById(id)
  }
}

const mutation = {
  addConversation: {
    type: conversationType,
    args: {
      userId: {
        type: new GraphQLNonNull(GraphQLString)
      },
      operatorId: {
        type: GraphQLString
      }
    },
    resolve: (obj, { userId, operatorId }) => create(userId, operatorId)
  }
}

const subscription = {}

export const ConversationSchema = {
  query,
  mutation,
  subscription,
  types: [conversationType]
}
