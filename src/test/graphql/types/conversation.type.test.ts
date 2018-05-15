import { graphql } from 'graphql'
import { schema } from '../../../../src/graphql'

describe('GQ Conversation', () => {
  it('should create a conversation', async () => {
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
    const { data: { addUser: { _id } } } = await graphql(schema, createUser)

    const query = `
      mutation{
        addConversation(userId: "${_id}") {
          _id
          messages{
            _id
          }
        }
      }
    `
    const { data: { addConversation } } = await graphql(schema, query)
    expect(addConversation._id).toBeDefined()
    expect(addConversation.messages).toHaveLength(0)
  })

  it('should get a conversation by id', async () => {
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
    const { data: { addUser: { _id } } } = await graphql(schema, createUser)

    const addConversationQuery = `
      mutation{
        addConversation(userId: "${_id}") {
          _id
          messages{
            _id
          }
        }
      }
    `
    const { data: { addConversation } } = await graphql(
      schema,
      addConversationQuery
    )

    const query = `
      query{
        conversationById(id: "${addConversation._id}"){
          _id
          messages{
            _id
          }
        }
      }
    `
    const { data: { conversationById } } = await graphql(schema, query)
    expect(conversationById._id).toBeDefined()
    expect(conversationById.messages).toHaveLength(0)
  })

  it('should get all conversations', async () => {
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
    const { data: { addUser: { _id } } } = await graphql(schema, createUser)

    const addConversationQuery = `
      mutation{
        addConversation(userId: "${_id}") {
          _id
          messages{
            _id
          }
        }
      }
    `
    await graphql(schema, addConversationQuery)

    const query = `
      query{
        conversations{
          _id
          messages{
            _id
          }
        }
      }
    `
    const { data: { conversations } } = await graphql(schema, query)
    expect(conversations).toBeDefined()
    expect(conversations).not.toHaveLength(0)
  })
})
