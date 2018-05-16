import * as request from 'supertest'
import { server } from '../../../server'

describe('Mails routes', () => {
  it('sends a mail', async () => {
    const result = await request(server.app)
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
    const mailResult = await request(server.app)
      .post('/api/mails/public')
      .set('Authorization', `Bearer ${token}`)
      .set('Content-Type', 'application/json')
      .send({
        subject: 'test',
        to: 'test@test.com',
        text: 'Test body'
      })
    expect(mailResult.status).toBe(200)
  })
})
