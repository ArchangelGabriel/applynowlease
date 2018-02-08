import sslRedirect from 'heroku-ssl-redirect'
import express from 'express'
import session from 'express-session'
import cookieParser from 'cookie-parser'
import bodyParser from 'body-parser'
import cors from 'cors'
import authenticationRoutes from 'server/routes/authentication'
import propertiesRoutes from 'server/routes/properties'
import applicationsRoutes from 'server/routes/applications'
import hellosigncallbackRoutes from 'server/routes/hellosigncallback'

import { SECRET } from './config'

const app = new express()

app.use(sslRedirect())
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))
app.use(express.static('src/client'))
app.use(cookieParser(SECRET))
app.use(session({ secret: SECRET }))

app.get('/health', (req, res) => res.sendStatus(200))

app.use(
  authenticationRoutes, 
  propertiesRoutes, 
  applicationsRoutes,
  hellosigncallbackRoutes
)

export default app