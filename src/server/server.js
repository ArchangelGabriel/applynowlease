import path from 'path'
import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import authenticationRoutes from 'server/routes/authentication'
import propertiesRoutes from 'server/routes/properties'
import applicationsRoutes from 'server/routes/applications'
import hellosigncallbackRoutes from 'server/routes/hellosigncallback'

const app = new express()

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))
app.use(express.static('src/client'))

app.get('/health', (req, res) => res.sendStatus(200))

app.use(
  authenticationRoutes, 
  propertiesRoutes, 
  applicationsRoutes,
  hellosigncallbackRoutes
)

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client', 'index.html'))
})

app.use(function (err, req, res, next) {
  if (err.name === 'UnauthorizedError') {
    res.status(401).json({ errors: { message: err.message } });
    return 
  }

  const errors = err.errors
  console.error(err)
  res.status(500).json({ errors })
})

export default app