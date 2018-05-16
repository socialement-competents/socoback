import { Document, model, Model, Schema } from 'mongoose'

const ConversationSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    operator: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    messages: [{ type: Schema.Types.ObjectId, ref: 'Message', default: [] }]
  },
  { timestamps: true }
)

ConversationSchema.methods = {}

export interface IConversation extends Document {
  user: Schema.Types.ObjectId
  operator: Schema.Types.ObjectId
  messages: Schema.Types.ObjectId[]
}

export const Conversation: Model<IConversation> = model<IConversation>(
  'Conversation',
  ConversationSchema,
  'conversation'
)
