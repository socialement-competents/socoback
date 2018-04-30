import * as http from 'http'
import * as express from 'express'
import * as session from 'express-session'
import * as graphqlHTTP from 'express-graphql'
import { urlencoded, json } from 'body-parser'
import { connect, createConnection } from 'mongoose'
import { config } from 'dotenv'
import * as cors from 'cors'
import * as logger from 'morgan'
import * as io from 'socket.io'

config()

import MainRouter from './routes'
import { graphqlSchema } from './graphql'

export class Server {
  public app: express.Application
  public io: io.Server
  private server: http.Server
  private isProduction: boolean = process.env.NODE_ENV === 'production'
  private secret: string = this.isProduction
    ? process.env.SESSION_SECRET
    : 'tennisify'

  constructor() {
    this.app = express()
    this.config()
    this.createServer()
    this.initSockets()
    this.routes()
  }

  private config() {
    try {
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
    this.app.use(new MainRouter(this.io).router)

    this.app.use(
      '/graphql',
      cors(),
      graphqlHTTP({
        schema: graphqlSchema,
        rootValue: global,
        graphiql: true
      })
    )

    this.app.get('/', (req, res) =>
      res.status(200).json({ message: 'Welcome home !' })
    )
  }

  private createServer() {
    this.server = http.createServer(this.app)
  }

  private initSockets() {
    this.io = io(this.server)
  }

  public static bootstrap(): Server {
    const app = new Server()
    app.io.on('connect', (socket: io.Socket) => {
      app.io.emit('any', 'Slt grigny le s')
      console.log(socket.id, socket.handshake.query)
      socket.on('disconnect', () => {
        console.log('Client disconnected')
      })
    })
    app.server.listen(app.app.get('port'), () => {
      console.log(`Server is listenning on port ${app.app.get('port')}`)
    })
    return app
  }
}

const app = new Server().app

export default app
