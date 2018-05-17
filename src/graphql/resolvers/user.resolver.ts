import { User } from '../../models/User'

export async function getAll(limit: number) {
  try {
    return await User.find()
      .limit(limit)
      .exec()
  } catch (e) {
    return e
  }
}

export async function getById(id: string) {
  try {
    return User.findById(id).exec()
  } catch (e) {
    return e
  }
}

export async function logIn(email: string, password: string) {
  try {
    const user = await User.findOne({ email }).exec()
    if (user && user.validPassword(password)) {
      return user.toAuthJSON()
    }
    return undefined
  } catch (e) {
    return e
  }
}

export async function create(
  email: string,
  password: string,
  firstname: string,
  lastname: string,
  image?: string
) {
  try {
    const user = new User()
    user.email = email
    user.firstname = firstname
    user.lastname = lastname
    user.image = image
    user.setPassword(password)

    const saved = await user.save()
    return saved.toAuthJSON()
  } catch (e) {
    return e
  }
}

export async function update(
  id: string,
  firstname?: string,
  lastname?: string,
  image?: string
) {
  try {
    await User.updateOne({ _id: id }, { firstname, lastname, image })
    const updated = await User.findById(id)
    return updated.toAuthJSON()
  } catch (e) {
    return e
  }
}
