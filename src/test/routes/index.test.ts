import * as request from 'supertest'
import { server } from '../../server'

describe('GET /health', () => {
  it('should return 200 OK', () => {
    return request(server.app)
      .get('/health')
      .expect(200)
  })

  it('should return 200 OK to graphiql', () => {
    return request(server.app)
      .get('/graphql')
      .expect(200)
  })

  it('should return 404 Not Found', () => {
    return request(server.app)
      .get('/api/')
      .expect(404)
  })
})
