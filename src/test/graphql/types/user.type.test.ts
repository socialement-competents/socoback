import { graphql } from 'graphql'
import { schema } from '../../../../src/graphql'

describe('GQ User', () => {
  it('should create an user', async () => {
    const mail = `intg-${new Date().getTime()}@ok.ok`
    const query = `
      mutation{
        addUser(email: "${mail}", lastname: "ok", firstname: "ok", password: "ok"){
          email
          firstname
          lastname
        }
      }
    `
    const { data: { addUser: { email, lastname, firstname } } } = await graphql(
      schema,
      query
    )
    expect(email).toBe(email)
    expect(lastname).toBe('ok')
    expect(firstname).toBe('ok')
  })

  it('should get an user by id', async () => {
    const mail = `test-${new Date().getTime()}@ok.ok`
    const createUser = `
      mutation{
        addUser(email: "${mail}", lastname: "ok", firstname: "ok", password: "ok"){
          _id
          email
          firstname
          lastname
        }
      }
    `
    const { data: { addUser: { email, _id } } } = await graphql(
      schema,
      createUser
    )

    const getUser = `
    query{
      userById(id: "${_id}") {
        email
      }
    }
    `
    const { data: { userById } } = await graphql(schema, getUser)
    expect(userById).toHaveProperty('email')
    expect(userById.email).toBe(email)
  })

  it('should get all users', async () => {
    const mail = `test-${new Date().getTime()}@ok.ok`
    const createUser = `
      mutation{
        addUser(email: "${mail}", lastname: "ok", firstname: "ok", password: "ok"){
          _id
          email
          firstname
          lastname
        }
      }
    `
    await graphql(schema, createUser)

    const getAllUsers = `
    query{
      users{
        email
      }
    }
    `
    const { data: { users } } = await graphql(schema, getAllUsers)
    expect(users).toBeDefined()
    expect(users).not.toHaveLength(0)
  })
})
