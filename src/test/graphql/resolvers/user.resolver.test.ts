import { create, getAll, getById } from '../../../graphql/resolvers/user.resolver'
import { server } from '../../../server'

beforeAll(() => {
  console.log = jest.fn
  console.info = jest.fn
  console.log(server)
})

describe('user controller', () => {
  const email = `test-${new Date().getTime()}@socoback.fr`
  const password = 'test'
  const firstname = 'rafou'
  const lastname = 'nadal'
  const image = 'randomImage'

  it('creates users', async () => {
    const result = await create(
      `create-${email}`,
      password,
      firstname,
      lastname,
      image
    )
    expect(result).toEqual(
      expect.objectContaining({
        email: expect.stringContaining('create-'),
        firstname: 'rafou',
        lastname: 'nadal',
        image: 'randomImage',
        token: expect.any(String)
      })
    )
  })

  it(`doesn't duplicate users`, async () => {
    try {
      await create(`not-unique@test.fr`, password, firstname, lastname)
      // this call must throw
      await create(`not-unique@test.fr`, password, firstname, lastname)
    } catch (e) {
      expect(e.toString()).toBe('ValidationError: email: is already taken')
    }
  })

  it('gets an user', async () => {
    const user = await create(`getbyid-${email}`, password, firstname, lastname)
    const id = user['_id']
    expect(id).toBeTruthy()

    const result = await getById(id)
    expect(result).toEqual(
      expect.objectContaining({
        email: expect.stringContaining('getbyid-'),
        firstname: 'rafou',
        lastname: 'nadal',
        salt: expect.any(String),
        hash: expect.any(String),
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date)
      })
    )
  })

  it('gets all users', async () => {
    await create(`getall1-${email}`, password, firstname, lastname)
    await create(`getall2-${email}`, password, firstname, lastname)
    await create(`getall3-${email}`, password, firstname, lastname)
    const max = 5
    const result = await getAll(max)

    expect(result.length).toBeGreaterThanOrEqual(3)
    expect(result.length).toBeLessThanOrEqual(max)

    expect(result[0]).toEqual(
      expect.objectContaining({
        salt: expect.any(String),
        hash: expect.any(String),
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date)
      })
    )
  })
})
