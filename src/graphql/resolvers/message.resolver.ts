import { withFilter } from 'graphql-subscriptions'
import { Schema } from 'mongoose'
import { pubsub } from '../pubsub'
import { Message } from '../../models/Message'
import { Conversation } from '../../models/Conversation'

export async function getAll(limit: number) {
  try {
    return await Message
      .find()
      .populate('user')
      .limit(limit)
      .exec()
  } catch (e) {
    return e
  }
}

export async function getById(id: string) {
  try {
    return await Message
      .findById(id)
      .populate('user')
      .exec()
  } catch (e) {
    return e
  }
}

export async function create(
  conversationId: Schema.Types.ObjectId,
  userId: Schema.Types.ObjectId,
  content: string
) {
  try {
    const conversation = await Conversation.findById(conversationId)
    const message = new Message()
    message.user = userId
    message.content = content
    const savedMessage = await message.save()
    pubsub.publish('messageAdded', { messageAdded: savedMessage, conversationId: conversation._id })
    conversation.messages.push(savedMessage._id)
    await conversation.save()
    return savedMessage
  } catch (e) {
    return e
  }
}

export const messageAdded = {
  subscribe: withFilter(
    () => pubsub.asyncIterator('messageAdded'),
    (payload, args) => payload.conversationId === args.conversationId
  )
}
