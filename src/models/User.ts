import { Document, model, Model, Schema } from 'mongoose'
import * as uniqueValidator from 'mongoose-unique-validator'
import { pbkdf2Sync, randomBytes } from 'crypto'
import { sign } from 'jsonwebtoken'

const secret = process.env.SESSION_SECRET

const UserSchema = new Schema(
  {
    email: {
      type: String,
      lowercase: true,
      unique: true,
      required: [true, "can't be blank"],
      match: [/\S+@\S+\.\S+/, 'is invalid']
    },
    firstname: {
      type: String,
      lowercase: true,
      required: [true, "can't be blank"]
    },
    lastname: {
      type: String,
      lowercase: true,
      required: [true, "can't be blank"]
    },
    hash: String,
    salt: String,
    isValidated: Boolean,
  },
  { timestamps: true }
)

UserSchema.plugin(uniqueValidator, { message: 'is already taken' })

UserSchema.virtual('fullname').get(() => `${this.firstname} ${this.lastname}`)

UserSchema.methods = {
  validPassword(password: string) {
    const hash = pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString(
      'hex'
    )
    return this.hash === hash
  },

  setPassword(password: string) {
    this.salt = randomBytes(16).toString('hex')
    this.hash = pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString(
      'hex'
    )
  },

  generateJWT() {
    const today = new Date()
    const exp = new Date(today)
    exp.setDate(today.getDate() + 60)

    return sign(
      {
        id: this._id,
        firstname: this.firstname,
        lastname: this.lastname,
        exp: exp.getTime() / 1000
      },
      secret
    )
  },

  toAuthJSON() {
    return {
      id: this._id,
      firstname: this.firstname,
      lastname: this.lastname,
      email: this.email,
      token: this.generateJWT()
    }
  },

  toProfileJSONFor(user: IUser) {
    return {
      firstname: this.firstname,
      lastname: this.lastname,
      fullname: this.fullname
    }
  }
}

export interface IUser extends Document {
  lastname: string
  firstname: string
  email: string
  hash: string
  salt: string
  token?: string
  fullname?: string
  isValidated: boolean
  toProfileJSONFor: (user: IUser) => IUser
  toAuthJSON: () => IUser
  generateJWT: () => string
  setPassword: (password: string) => void
  validPassword: (password: string) => boolean
}

export const User: Model<IUser> = model<IUser>('User', UserSchema)
