import { Request } from 'express'
import * as jwt from 'express-jwt'

const secret = process.env.SESSION_SECRET

export function getTokenFromHeader(req: Request) {
  const auth =
    req.headers.authorization &&
    (req.headers.authorization as string).split(' ')
  if (auth && (auth[0] === 'Token' || auth[0] === 'Bearer')) {
    return auth[1]
  }

  return undefined
}

export const auth = {
  required: jwt({
    secret: secret,
    userProperty: 'payload',
    getToken: getTokenFromHeader
  }),
  optional: jwt({
    secret: secret,
    userProperty: 'payload',
    credentialsRequired: false,
    getToken: getTokenFromHeader
  })
}
