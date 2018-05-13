import * as request from 'supertest'
import app from '../../../server'

describe('Users routes', () => {
  it('creates an user', async () => {
    const result = await request(app)
      .post('/api/users')
      .send({
        firstname: 'Rafael',
        lastname: 'Nadal',
        email: `intg-test-${new Date().getTime()}@tennisi.fy`,
        password: 'ok'
      })
      .set('content-type', 'application/json')

    const { firstname, email, token } = result.body

    expect(result.status).toBe(200)
    expect(firstname).toBe('rafael')
    expect(email).toContain('@tennisi.fy')
    expect(token).toBeTruthy()
  })

  it('modifies an user', async () => {
    const createResult = await request(app)
      .post('/api/users')
      .send({
        firstname: 'Rafael',
        lastname: 'Nadal',
        email: `intg-test-${new Date().getTime()}@tennisi.fy`,
        password: 'ok'
      })
      .set('content-type', 'application/json')

    expect(createResult.status).toBe(200)

    const { token, id } = createResult.body

    const putResult = await request(app)
      .put(`/api/users/${id}`)
      .set('Authorization', `Bearer ${token}`)
      .set('Content-Type', 'application/json')
      .send({
        firstname: 'roger',
        lastname: 'federer'
      })

    expect(putResult.status).toBe(200)
    expect(putResult.body.lastname).toBe('federer')
    expect(putResult.body.firstname).toBe('roger')
  })
})
