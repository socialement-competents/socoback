import { Document, model, Model, Schema } from 'mongoose'
import * as uniqueValidator from 'mongoose-unique-validator'
import { pbkdf2Sync, randomBytes } from 'crypto'
import { sign, SignOptions } from 'jsonwebtoken'

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
    bio: String,
    image: String,
    atpRank: Number,
    following: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    hash: String,
    salt: String
  },
  { timestamps: true }
)

UserSchema.plugin(uniqueValidator, { message: 'is already taken' })

UserSchema.virtual('fullname').get(() => `${this.firstname} ${this.lastname}`)

UserSchema.methods = {
  validPassword (password: string) {
    const hash = pbkdf2Sync(password, this.salt, 10000, 512, 'sha512')
      .toString('hex')
    return this.hash === hash
  },

  setPassword (password: string) {
  this.salt = randomBytes(16).toString('hex')
  this.hash = pbkdf2Sync(password, this.salt, 10000, 512, 'sha512')
    .toString('hex')
  },

  generateJWT () {
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

  toAuthJSON () {
    return {
      id: this._id,
      firstname: this.firstname,
      lastname: this.lastname,
      email: this.email,
      token: this.generateJWT(),
      bio: this.bio,
      image: this.image,
      atpRank: this.atpRank,
      favorites: this.favorites,
      following: this.following
    }
  },

  toProfileJSONFor (user: IUser) {
    return {
      firstname: this.firstname,
      lastname: this.lastname,
      fullname: this.fullname,
      bio: this.bio,
      image:
        this.image || 'https://static.productionready.io/images/smiley-cyrus.jpg',
      following: user ? user.isFollowing(this._id) : false,
      favorites: this.favorites
    }
  },

  favorite (id: Schema.Types.ObjectId) {
    if (this.favorites.indexOf(id) === -1) {
      this.favorites.push(id)
    }

    return this.save()
  },

  unfavorite (id: Schema.Types.ObjectId) {
    this.favorites.remove(id)
    return this.save()
  },

  isFavorite (id: Schema.Types.ObjectId) {
    return this.favorites.some((favoriteId: Schema.Types.ObjectId) =>
    favoriteId.toString() === id.toString())
  },

  follow (id: Schema.Types.ObjectId) {
    if (this.following.indexOf(id) === -1) {
      this.following.push(id)
    }
    return this.save()
  },

  unfollow (id: Schema.Types.ObjectId) {
    this.following.remove(id)
    return this.save()
  },

  isFollowing (id: Schema.Types.ObjectId) {
    return this.following.some((followId: Schema.Types.ObjectId) =>
    followId.toString() === id.toString())
  }
}

export interface IUser extends Document {
  lastname: string
  firstname: string
  email: string
  bio: string
  image: string
  atpRank: number
  favorites: Schema.Types.ObjectId[]
  following: Schema.Types.ObjectId[]
  hash: string
  salt: string
  token?: SignOptions
  fullname?: string
  isFollowing: (id: Schema.Types.ObjectId) => boolean
  unfollow: (id: Schema.Types.ObjectId) => Promise<any>
  follow: (id: Schema.Types.ObjectId) => Promise<any>
  isFavorite: (id: Schema.Types.ObjectId) => Promise<any>
  unfavorite: (id: Schema.Types.ObjectId) => Promise<any>
  favorite: (id: Schema.Types.ObjectId) => Promise<any>
  toProfileJSONFor: (user: IUser) => IUser
  toAuthJSON: () => IUser
  generateJWT: () => SignOptions
  setPassword: (password: string) => void
  validPassword: (password: string) => boolean
}

export const User: Model<IUser> = model<IUser>('User', UserSchema)
