import * as MockExpressRequest from 'mock-express-request'
import { Request } from 'express'

import { getTokenFromHeader } from '../../routes/auth'

describe('Auth', () => {
  it('parses token from requests', () => {
    const req: Request = new MockExpressRequest({
      headers: {
        authorization: 'Token abcd'
      }
    })

    const actual = getTokenFromHeader(req)
    const expected = 'abcd'
    expect(actual).toBe(expected)
  })

  it('parses bearer from requests', () => {
    const req: Request = new MockExpressRequest({
      headers: {
        authorization: 'Bearer efgh'
      }
    })

    const actual = getTokenFromHeader(req)
    const expected = 'efgh'
    expect(actual).toBe(expected)
  })
})