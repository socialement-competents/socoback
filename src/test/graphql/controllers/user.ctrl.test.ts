import { create, getAll, getById } from '../../../graphql/controllers/user.ctrl'

describe('user controller', () => {
  const email = `test-${new Date().getTime()}@backathon.fr`
  const password = 'test'
  const firstname = 'rafou'
  const lastname = 'nadal'
  // on mock le console.log pour éviter de spam STDIN
  console.log = jest.fn

  it('creates users', async () => {
    const result = await create(`create-${email}`, password, firstname, lastname)
    expect(result).toEqual(
      expect.objectContaining({
        email: expect.stringContaining('create-'),
        firstname: 'rafou',
        lastname: 'nadal',
        salt: expect.any(String),
        hash: expect.any(String),
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date)
      }))
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
      }))
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
      }))
  })
})