import {
  create as createConv,
  getAll,
  getById,
  update
} from '../../../graphql/resolvers/conversation.resolver'
import { create as createUser } from '../../../graphql/resolvers/user.resolver'
import { server } from '../../../server'

beforeAll(() => {
  console.log = jest.fn
  console.info = jest.fn
  console.log(server)
})

describe('conversation controller', () => {

  it('creates conversation', async () => {
    const user = await createUser(
      `user-conversation-${new Date().getTime()}@socoback.fr`,
      'a',
      'a',
      'a'
    )
    const op = await createUser(
      `op-conversation-${new Date().getTime()}@socoback.fr`,
      'b',
      'b',
      'b'
    )
    const userId = user['_id']
    const opId = op['_id']
    const conv = await createConv(userId, opId)

    expect(conv['id']).toBeTruthy()
  })

  it('modifies conversation', async () => {
    const user = await createUser(
      `user-conversation-${new Date().getTime()}@socoback.fr`,
      'a',
      'a',
      'a'
    )
    const op = await createUser(
      `op-conversation-${new Date().getTime()}@socoback.fr`,
      'b',
      'b',
      'b'
    )
    const userId = user['_id']
    const opId = op['_id']
    const conv = await createConv(userId)

    const updated = await update(conv.id, opId)

    expect(updated.operator).toBeDefined()
  })

  it('gets a conversation', async () => {
    const user = await createUser(
      `user-conversation-${new Date().getTime()}@socoback.fr`,
      'a',
      'a',
      'a'
    )
    const op = await createUser(
      `op-conversation-${new Date().getTime()}@socoback.fr`,
      'b',
      'b',
      'b'
    )
    const conv = await createConv(user['_id'], op['_id'])
    const getConv = await getById(conv['_id'])
    expect(getConv._id).toBeDefined()
    expect(getConv.user).toBeDefined()
    expect(getConv.operator).toBeDefined()
    expect(getConv.messages).toBeDefined()
  })

  it('gets several conversations', async () => {
    const user = await createUser(
      `user-conversation-${new Date().getTime()}@socoback.fr`,
      'a',
      'a',
      'a'
    )
    const op = await createUser(
      `op-conversation-${new Date().getTime()}@socoback.fr`,
      'b',
      'b',
      'b'
    )

    await createConv(user['_id'], op['_id'])
    await createConv(user['_id'], op['_id'])
    await createConv(user['_id'], op['_id'])

    const max = 5
    const result = await getAll(max)

    expect(result.length).toBeGreaterThanOrEqual(3)
    expect(result.length).toBeLessThanOrEqual(max)
    expect(result[0].user['email']).toBeTruthy()
  })
})
