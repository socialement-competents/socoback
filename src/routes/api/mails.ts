import {
  Router,
  Request,
  Response,
  NextFunction
} from 'express'
import { createTransport } from 'nodemailer'

import { auth } from '../auth'

interface IMail extends Document {
  subject: String
  to: String
  text: String
}

export default class MailRouter {

  public router: Router
  private emailHost: string = process.env.EMAIL_HOST
  private emailPort: string = process.env.EMAIL_PORT
  private userMail = process.env.USER_MAILER
  private passwordMail = process.env.USER_PASSWORD_MAILER

  constructor() {
    this.router = Router()
    this.init()
  }

  private init() {
    this.router.post(
      '/public',
      auth.required,
      (
        req: Request,
        res: Response,
        next: NextFunction
      ) => {
        const {
          subject,
          to,
          text
        } = req.body

        const auth = process.env.NODE_ENV === 'production' ? {
          user: this.userMail,
          pass: this.passwordMail
        } : undefined

        const transporter = createTransport({
          host: this.emailHost,
          port: parseInt(this.emailPort),
          secure: false,
          ignoreTLS: true,
          auth
        })

        const mailOptions = {
          from: '"Hackathon APP" <hackathonapp@gmail.com>',
          to: to.toString(),
          subject: subject.toString(),
          text: text.toString(),
          html: '<h1>Hello Hackathon</h1>'
        }

        transporter.sendMail(mailOptions, (error, info) => res.sendStatus(error ? 500 : 200))
      }
    )
  }
}
