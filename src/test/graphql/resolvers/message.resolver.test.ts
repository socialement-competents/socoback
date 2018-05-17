import {
  create,
  getAll,
  getById
} from '../../../graphql/resolvers/message.resolver'
import { create as createConv } from '../../../graphql/resolvers/conversation.resolver'
import { create as createUser } from '../../../graphql/resolvers/user.resolver'
import { server } from '../../../server'

beforeAll(() => {
  console.log = jest.fn
  console.info = jest.fn
  console.log(server)
})

describe('message controller', () => {

  it('creates messages', async () => {
    const user = await createUser(
      `user-message-${new Date().getTime()}@socoback.fr`,
      'a',
      'a',
      'a'
    )
    const op = await createUser(
      `op-message-${new Date().getTime()}@socoback.fr`,
      'b',
      'b',
      'b'
    )
    const userId = user['_id']
    const opId = op['_id']
    const conv = await createConv(userId, opId)
    const conversationId = conv['_id']

    const result = await create(conversationId, 'wonderful message', userId)

    expect(result['id']).toBeTruthy()
  })

  it('gets a message', async () => {
    const user = await createUser(
      `user-message-${new Date().getTime()}@socoback.fr`,
      'a',
      'a',
      'a'
    )
    const op = await createUser(
      `op-message-${new Date().getTime()}@socoback.fr`,
      'b',
      'b',
      'b'
    )
    const userId = user['_id']
    const opId = op['_id']
    const conv = await createConv(userId, opId)
    const conversationId = conv['_id']

    await create(
      conversationId,
      'another message to make sure it gets the right one',
      userId
    )
    const msg = await create(conversationId, 'wonderful message', userId)
    await create(conversationId, 'yet another message', userId)

    const msgId = msg['_id']
    expect(msgId).toBeTruthy()
    const result = await getById(msgId)
    expect(result.content).toBe('wonderful message')
  })

  it('gets several messages', async () => {
    const user = await createUser(
      `user-message-${new Date().getTime()}@socoback.fr`,
      'a',
      'a',
      'a'
    )
    const op = await createUser(
      `op-message-${new Date().getTime()}@socoback.fr`,
      'b',
      'b',
      'b'
    )
    const userId = user['_id']
    const opId = op['_id']
    const conv = await createConv(userId, opId)
    const conversationId = conv['_id']

    await create(conversationId, 'wonderful message1', userId)
    await create(conversationId, 'wonderful message2', opId)
    await create(conversationId, 'wonderful message3', userId)

    const max = 5
    const result = await getAll(max)

    expect(result.length).toBeGreaterThanOrEqual(3)
    expect(result.length).toBeLessThanOrEqual(max)
    expect(result[0].user['email']).toBeTruthy()
  })
})
