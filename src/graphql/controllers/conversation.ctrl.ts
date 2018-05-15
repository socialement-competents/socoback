import { Schema } from 'mongoose'
import { Conversation } from '../../models/Conversation'

export function getAll(limit: number) {
  return Conversation.find()
    .populate('user')
    .populate('operator')
    .populate('messages')
    .limit(limit)
    .exec()
}

export async function getById(id: string) {
  return await Conversation.findById(id)
    .populate('user')
    .populate('operator')
    .populate('messages')
}

export async function create(
  userId: Schema.Types.ObjectId,
  operatorId: Schema.Types.ObjectId
) {
  try {
    const conversation = new Conversation()
    conversation.user = userId
    conversation.operator = operatorId
    return await conversation.save()
  } catch (e) {
    return e
  }
}
