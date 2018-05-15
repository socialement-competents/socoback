import { withFilter } from 'graphql-subscriptions'
import { Schema } from 'mongoose'
import { pubsub } from '../pubsub'
import { Message } from '../../models/Message'
import { Conversation } from '../../models/Conversation'

export function getAll(limit: number) {
  return Message.find()
    .populate('user')
    .limit(limit)
    .exec()
}

export function getById(id: string) {
  return Message.findById(id)
    .populate('user')
    .exec()
}

export async function create(
  conversationId: Schema.Types.ObjectId,
  userId: Schema.Types.ObjectId,
  content: string
) {
  const conversation = await Conversation.findById(conversationId)
  const message = new Message()
  message.user = userId
  message.content = content
  const savedMessage = await message.save()
  pubsub.publish('messageAdded', { messageAdded: savedMessage })
  conversation.messages.push(savedMessage._id)
  await conversation.save()
  return savedMessage
}

export const messageAdded = {
  subscribe: withFilter(
    () => pubsub.asyncIterator('messageAdded'),
    (payload, args) => {
      return payload.messageAdded.id === args.id
    }
  )
}
