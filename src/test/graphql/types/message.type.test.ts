import { graphql } from 'graphql'
import { schema } from '../../../../src/graphql'

describe('GQ Message', () => {
  it('should create a message', async () => {
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

    const messageQuery = `
      mutation{
        addMessage(conversationId: "${
          addConversation._id
        }", userId: "${_id}", content: "hello"){
          _id
          content
        }
      }
    `
    const { data: { addMessage } } = await graphql(schema, messageQuery)
    expect(addMessage._id).toBeDefined()
    expect(addMessage.content).toBe('hello')
  })

  it('should read a message by id', async () => {
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

    const messageMutation = `
      mutation{
        addMessage(conversationId: "${
          addConversation._id
        }", userId: "${_id}", content: "hello"){
          _id
          content
        }
      }
    `
    const { data: { addMessage } } = await graphql(schema, messageMutation)

    const messageQuery = `
      query{
        messageById(id: "${addMessage._id}"){
          _id
          isRead
          content
        }
      }
    `
    const { data: { messageById } } = await graphql(schema, messageQuery)
    expect(messageById._id).toBe(addMessage._id)
    expect(messageById.content).toBe('hello')
    expect(messageById.isRead).toBeFalsy()
  })

  it('should read all messages', async () => {
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

    const messageMutation = `
      mutation{
        addMessage(conversationId: "${
          addConversation._id
        }", userId: "${_id}", content: "hello"){
          _id
          content
        }
      }
    `
    await graphql(schema, messageMutation)

    const messageQuery = `
      query{
        messages{
          _id
          isRead
          content
        }
      }
    `
    const { data: { messages } } = await graphql(schema, messageQuery)
    expect(messages).toBeDefined()
    expect(messages).not.toHaveLength(0)
  })
})
