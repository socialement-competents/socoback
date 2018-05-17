import {
  GraphQLObjectType,
  GraphQLList,
  GraphQLNonNull,
  GraphQLString,
  GraphQLInt,
  GraphQLBoolean
} from 'graphql'
import { userType } from './user'
import {
  getAll,
  getById,
  messageAdded,
  create
} from '../resolvers/message.resolver'

export const messageType = new GraphQLObjectType({
  name: 'Message',
  description: 'Message type',
  fields: () => ({
    _id: {
      type: GraphQLString,
      description: 'The id'
    },
    isRead: {
      type: GraphQLBoolean,
      description: 'is the message read'
    },
    user: {
      type: userType,
      description: 'The user who sent the message'
    },
    content: {
      type: GraphQLString,
      description: 'The message content'
    },
    createdAt: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'Messages of conversations'
    }
  })
})

const query = {
  messages: {
    type: new GraphQLList(messageType),
    args: {
      limit: {
        description: 'limit items in the results',
        type: GraphQLInt
      }
    },
    resolve: (root, { limit }) => getAll(limit)
  },
  messageById: {
    type: messageType,
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
  addMessage: {
    type: messageType,
    args: {
      conversationId: {
        type: new GraphQLNonNull(GraphQLString)
      },
      userId: {
        type: new GraphQLNonNull(GraphQLString)
      },
      content: {
        type: new GraphQLNonNull(GraphQLString)
      }
    },
    resolve: (obj, { conversationId, userId, content }) =>
      create(conversationId, userId, content)
  }
}

const subscription = {
  messageAdded: {
    type: messageType,
    args: {
      id: {
        description: 'conversation id',
        type: GraphQLString
      }
    },
    ...messageAdded
  }
}

export const MessageSchema = {
  query,
  mutation,
  subscription,
  types: [messageType]
}
