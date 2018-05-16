import {
  GraphQLObjectType,
  GraphQLList,
  GraphQLNonNull,
  GraphQLString,
  GraphQLInt
} from 'graphql'

import { getAll, getById, create, logIn } from '../resolvers/user.resolver'

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
    image: {
      type: GraphQLString,
      description: 'The image/avatar'
    },
    token: {
      type: GraphQLString,
      description: 'Token used to authenticate requests'
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
    resolve: (root, { limit }) => getAll(limit)
  },
  userById: {
    type: userType,
    args: {
      id: {
        description: 'find by id',
        type: GraphQLString
      }
    },
    resolve: (root, { id }) => getById(id)
  },
  logIn: {
    type: userType,
    args: {
      email: {
        description: 'email',
        type: GraphQLString
      },
      password: {
        description: 'password',
        type: GraphQLString
      }
    },
    resolve: (root, { email, password }) => logIn(email, password)
  }
}

const mutation = {
  addUser: {
    type: userType,
    args: {
      email: {
        type: new GraphQLNonNull(GraphQLString)
      },
      password: {
        type: new GraphQLNonNull(GraphQLString)
      },
      firstname: {
        type: new GraphQLNonNull(GraphQLString)
      },
      lastname: {
        type: new GraphQLNonNull(GraphQLString)
      },
      image: {
        type: GraphQLString
      }
    },
    resolve: (obj, { email, password, firstname, lastname, image }) =>
      create(email, password, firstname, lastname, image)
  }
}

const subscription = {}

export const UserSchema = {
  query,
  mutation,
  subscription,
  types: [userType]
}
