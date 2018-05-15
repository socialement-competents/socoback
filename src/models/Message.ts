import { Document, model, Model, Schema } from 'mongoose'

const MessageSchema = new Schema(
  {
    content: {
      type: String,
      required: true
    },
    isRead: {
      type: Boolean,
      default: false
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, "can't be blank"]
    }
  },
  { timestamps: true }
)

MessageSchema.methods = {}

export interface IMessage extends Document {
  user: Schema.Types.ObjectId
  isRead: boolean
  content: string
}

export const Message: Model<IMessage> = model<IMessage>(
  'Message',
  MessageSchema
)
