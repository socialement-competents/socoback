import * as request from 'supertest'
import app from '../../../server'

describe('Users routes', () => {
  it('creates an user', async () => {
    const result = await request(app)
      .post('/api/users')
      .send({
        firstname: 'rafael',
        lastname: 'nadal',
        email: `intg-test-${new Date().getTime()}@tennisi.fy`,
        password: 'ok'
      })
      .set('content-type', 'application/json')

    const { firstname, lastname, email, token } = result.body

    expect(result.status).toBe(200)
    expect(firstname).toBe('rafael')
    expect(lastname).toBe('nadal')
    expect(email).toContain('@tennisi.fy')
    expect(token).toBeTruthy()
  })

  it('rejects log in', async () => {
    const email = `intg-test-${new Date().getTime()}@tennisi.fy`
    await request(app)
      .post('/api/users')
      .send({
        firstname: 'rafael',
        lastname: 'nadal',
        email,
        password: 'ok'
      })
      .set('content-type', 'application/json')
    const result = await request(app)
      .post('/api/users/login')
      .send({
        email,
        password: 'wrongpassword'
      })
    expect(result.status).toBe(422)
  })

  it('logs in successfully', async () => {
    const email = `intg-test-${new Date().getTime()}@tennisi.fy`
    await request(app)
      .post('/api/users')
      .send({
        firstname: 'rafael',
        lastname: 'nadal',
        email,
        password: 'ok'
      })
      .set('content-type', 'application/json')
    const result = await request(app)
      .post('/api/users/login')
      .send({
        email,
        password: 'ok'
      })
    expect(result.status).toBe(200)
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
