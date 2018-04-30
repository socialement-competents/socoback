import * as request from 'supertest'
import app from '../../server'

describe('GET /', () => {
  it('should return 200 OK', () => {
    return request(app)
      .get('/')
      .expect(200)
  })

  it('should return 404 Not Found', () => {
    return request(app)
      .get('/api/')
      .expect(404)
  })
})
