import {
  GraphQLEnumType,
  GraphQLInterfaceType,
  GraphQLObjectType,
  GraphQLList,
  GraphQLNonNull,
  GraphQLSchema,
  GraphQLString,
  GraphQLInt
} from 'graphql'

import { User, IUser } from '../models/User'

export const userType = new GraphQLObjectType({
  name: 'User',
  description: 'User type',
  fields: () => ({
    _id: {
      type: GraphQLString,
      description: 'The id'
    },
    email: {
      type: GraphQLString,
      description: 'The email'
    },
    firstname: {
      type: GraphQLString,
      description: 'The firstname'
    },
    lastname: {
      type: GraphQLString,
      description: 'The lastname'
    },
    bio: {
      type: GraphQLString,
      description: 'The bio'
    },
    image: {
      type: GraphQLString,
      description: 'The image'
    },
    cards: {
      type: new GraphQLList(GraphQLString),
      description: 'The cards'
    }
  })
})

const query = {
  users: {
    type: new GraphQLList(userType),
    args: {
      limit: {
        description: 'limit items in the results',
        type: GraphQLInt
      }
    },
    resolve: (root, { limit }) =>
      User.find()
        .populate('cards')
        .limit(limit)
        .exec()
  },
  userById: {
    type: userType,
    args: {
      id: {
        description: 'find by id',
        type: GraphQLString
      }
    },
    resolve: (root, { id }) =>
      User.findById(id)
        .populate('cards')
        .exec()
  }
}

const mutation = {
  addUser: {
    type: userType,
    args: {
      username: {
        type: new GraphQLNonNull(GraphQLString)
      },
      password: {
        type: new GraphQLNonNull(GraphQLString)
      }
    },
    resolve: (obj, input) => new User().save()
  }
}

const subscription = {}

export const UserSchema = {
  query,
  mutation,
  subscription,
  types: [userType]
}
