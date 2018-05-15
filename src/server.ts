import { createServer as createHttpServer, Server as httpServer } from 'http'
import * as express from 'express'
import * as session from 'express-session'
import * as graphqlHTTP from 'express-graphql'
import { SubscriptionServer } from 'subscriptions-transport-ws'
import { execute, subscribe } from 'graphql'
import { urlencoded, json } from 'body-parser'
import { connect, createConnection, set } from 'mongoose'
import { createTransport, Transporter } from 'nodemailer'
import { config } from 'dotenv'
import * as cors from 'cors'
import * as logger from 'morgan'
import * as io from 'socket.io'

config()

import MainRouter from './routes'
import { schema } from './graphql'

export class Server {
  public app: express.Application
  private io: io.Server
  private server: httpServer
  public transporter: Transporter
  private isProduction: boolean = process.env.NODE_ENV === 'production'
  private secret: string = process.env.SESSION_SECRET
  private emailHost: string = process.env.EMAIL_HOST
  private emailPort: string = process.env.EMAIL_PORT
  private userMail: string = process.env.USER_MAILER
  private passwordMail: string = process.env.USER_PASSWORD_MAILER
  private WS_GQL_PATH = '/subscriptions'

  constructor() {
    this.app = express()
    this.config()
    this.createServer()
    this.initSockets()
    this.initTransporter()
    this.routes()
    if (this.isProduction) {
      new SubscriptionServer(
        { schema, execute, subscribe },
        { server: this.server, path: this.WS_GQL_PATH }
      )
    }
  }

  private config() {
    try {
      if (!this.isProduction) set('debug', true)
      connect(process.env.MONGODB_URI)
    } catch (e) {
      createConnection(process.env.MONGODB_URI)
    }

    this.app.set('port', process.env.PORT || 3000)
    this.app.use(cors())
    this.app.use(logger('dev'))
    this.app.use(urlencoded({ extended: false }))
    this.app.use(json())
    this.app.use('/public', express.static('public'))
    this.app.use(
      session({
        secret: this.secret,
        cookie: { maxAge: 60000 },
        resave: false,
        saveUninitialized: false
      })
    )
  }

  private routes() {
    this.app.use(new MainRouter(this.io, this.transporter).router)

    this.app.use(
      '/graphql',
      cors(),
      graphqlHTTP({
        schema,
        rootValue: global,
        graphiql: true
      })
    )

    this.app.get('/health', (req, res) =>
      res.status(200).json({ message: 'Is healthy' })
    )
  }

  private createServer() {
    this.server = createHttpServer(this.app)
  }

  private initSockets() {
    this.io = io(this.server)
  }

  private initTransporter() {
    const auth = this.isProduction
      ? {
          user: this.userMail,
          pass: this.passwordMail
        }
      : undefined

    this.transporter = createTransport({
      host: this.emailHost,
      port: parseInt(this.emailPort),
      secure: false,
      ignoreTLS: true,
      auth
    })
  }

  public static bootstrap(): Server {
    const app = new Server()
    app.io.on('connect', (socket: io.Socket) => {
      console.log(socket.id, socket.handshake.query)
      socket.on('disconnect', () => {
        console.log('Client disconnected')
      })
    })
    app.server.listen(app.app.get('port'), () => {
      console.log(`Server is listening on port ${app.app.get('port')}`)
    })
    return app
  }
}

export const server = new Server()

export default server.app
