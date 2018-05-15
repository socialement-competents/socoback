import {
  create,
  getAll,
  getById
} from '../../../graphql/controllers/message.ctrl'
import { create as createConv } from '../../../graphql/controllers/conversation.ctrl'
import { create as createUser } from '../../../graphql/controllers/user.ctrl'

describe('user controller', () => {
  console.log = jest.fn
  console.info = jest.fn

  it('creates messages', async () => {
    const user = await createUser(
      `user-${new Date().getTime()}@socoback.fr`,
      'a',
      'a',
      'a'
    )
    const op = await createUser(
      `op-${new Date().getTime()}@socoback.fr`,
      'b',
      'b',
      'b'
    )
    const userId = user['_id']
    const opId = op['_id']
    const conv = await createConv(userId, opId)
    const conversationId = conv['_id']

    const result = await create(conversationId, userId, 'wonderful message')

    expect(result['id']).toBeTruthy()
  })

  it('gets a message', async () => {
    const user = await createUser(
      `user-${new Date().getTime()}@socoback.fr`,
      'a',
      'a',
      'a'
    )
    const op = await createUser(
      `op-${new Date().getTime()}@socoback.fr`,
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
      userId,
      'another message to make sure it gets the right one'
    )
    const msg = await create(conversationId, userId, 'wonderful message')
    await create(conversationId, userId, 'yet another message')

    const msgId = msg['_id']
    expect(msgId).toBeTruthy()
    const result = await getById(msgId)
    expect(result.content).toBe('wonderful message')
  })

  it('gets several messages', async () => {
    const user = await createUser(
      `user-${new Date().getTime()}@socoback.fr`,
      'a',
      'a',
      'a'
    )
    const op = await createUser(
      `op-${new Date().getTime()}@socoback.fr`,
      'b',
      'b',
      'b'
    )
    const userId = user['_id']
    const opId = op['_id']
    const conv = await createConv(userId, opId)
    const conversationId = conv['_id']

    await create(conversationId, userId, 'wonderful message1')
    await create(conversationId, opId, 'wonderful message2')
    await create(conversationId, userId, 'wonderful message3')

    const max = 5
    const result = await getAll(max)

    expect(result.length).toBeGreaterThanOrEqual(3)
    expect(result.length).toBeLessThanOrEqual(max)
    expect(result[0].user['email']).toBeTruthy()
  })
})
