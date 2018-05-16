import { User } from '../../models/User'

export function getAll(limit: number) {
  return User.find()
    .limit(limit)
    .exec()
}

export function getById(id: string) {
  return User.findById(id).exec()
}

export async function logIn(email: string, password: string) {
  const user = await User.findOne({ email }).exec()
  if (user && user.validPassword(password)) {
    return user.toAuthJSON()
  }
  return undefined
}

export async function create(
  email: string,
  password: string,
  firstname: string,
  lastname: string
) {
  const user = new User()
  user.email = email
  user.firstname = firstname
  user.lastname = lastname
  user.setPassword(password)

  return await user.save()
}
