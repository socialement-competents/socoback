import { withFilter } from 'graphql-subscriptions'
import { Schema } from 'mongoose'
import { pubsub } from '../pubsub'
import { Conversation } from '../../models/Conversation'

export async function getAll(limit?: number) {
  try {
    return await Conversation.find()
      .populate('user')
      .populate('operator')
      .populate('messages')
      .limit(limit)
      .exec()
  } catch (e) {
    return e
  }
}

export async function getById(id: string) {
  try {
    return await Conversation.findById(id)
      .populate('user')
      .populate('operator')
      .populate('messages')
  } catch (e) {
    return e
  }
}

export async function create(
  userId: Schema.Types.ObjectId,
  operatorId?: Schema.Types.ObjectId
) {
  try {
    const conversation = new Conversation()
    conversation.user = userId
    conversation.operator = operatorId
    const saved = await conversation.save()
    pubsub.publish('conversationAdded', { conversationAdded: saved })
    return saved
  } catch (e) {
    return e
  }
}

export async function update(
  id: Schema.Types.ObjectId,
  operator: Schema.Types.ObjectId
) {
  try {
    await Conversation.updateOne({ _id: id }, { operator })
    return await Conversation.findById(id).populate('operator').exec()
  } catch (e) {
    return e
  }
}

export const conversationUpdated = {
  subscribe: withFilter(
    () => pubsub.asyncIterator('conversationUpdated'),
    (payload, args) => true
  )
}

export const conversationAdded = {
  subscribe: withFilter(
    () => pubsub.asyncIterator('conversationAdded'),
    (payload, args) => true
  )
}
