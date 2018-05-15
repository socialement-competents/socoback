import { User } from '../../models/User'
import { server } from '../../server'

export function getAll(limit: number) {
  return User.find()
    .limit(limit)
    .exec()
}

export function getById(id: string) {
  return User.findById(id).exec()
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

  const mailOptions = {
    from: '"Hackathon APP" <hackathonapp@gmail.com>',
    to: email,
    subject: 'Account validation',
    text:
      'Hello there, please get validate your account by clicking on the link: ',
    html: `
      <h1>Hello ${firstname} ${lastname}</h1>
      <p>Please validate your account by clicking on the link</p>
    `
  }
  const saved = await user.save()
  server.transporter.sendMail(mailOptions, err => {
    if (err) console.log(err)
  })
  return saved
}
