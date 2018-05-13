import { Router, Request, Response, NextFunction } from 'express'
import { Transporter } from 'nodemailer'
import { auth } from '../auth'

interface IMail extends Document {
  subject: String
  to: String
  text: String
}

export default class MailRouter {
  public router: Router

  constructor(private transporter: Transporter) {
    this.router = Router()
    this.init()
  }

  private init() {
    this.router.post(
      '/public',
      auth.required,
      (req: Request, res: Response, next: NextFunction) => {
        const { subject, to, text } = req.body

        const mailOptions = {
          from: '"Hackathon APP" <hackathonapp@gmail.com>',
          to: to.toString(),
          subject: subject.toString(),
          text: text.toString(),
          html: '<h1>Hello Hackathon</h1>'
        }

        this.transporter.sendMail(mailOptions, (error, info) =>
          res.sendStatus(error ? 500 : 200)
        )
      }
    )
  }
}
