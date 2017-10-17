import express from 'express'
import bodyParser from 'body-parser'
import authenticationRoutes from 'server/routes/authentication'
import propertiesRoutes from 'server/routes/properties'

const app = new express()

app.use(bodyParser.json())

app.get('/health', (req, res) => res.sendStatus(200))

app.use(authenticationRoutes, propertiesRoutes)

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