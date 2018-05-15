import { Document, model, Model, Schema } from 'mongoose'

const ConversationSchema = new Schema(
  {
    isHandled: {
      type: Boolean,
      default: false
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, "can't be blank"]
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
  isHandled: boolean
  messages: Schema.Types.ObjectId[]
}

export const Conversation: Model<IConversation> = model<IConversation>(
  'Conversation',
  ConversationSchema
)
