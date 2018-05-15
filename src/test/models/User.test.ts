import { User } from '../../models/User'

describe('user controller', () => {
  const password = 'test'
  const firstname = 'rafou'
  const lastname = 'nadal'

  it('generates a JWT', () => {
    const email = `test-${new Date().getTime()}@socoback.fr`
    const user = new User()
    user.email = email
    user.firstname = firstname
    user.lastname = lastname
    user.setPassword(password)
    user.save()
    const jwt = user.generateJWT()
    expect(typeof jwt).toBe('string')
    expect(jwt.length).toBeGreaterThan(20)
  })
})
