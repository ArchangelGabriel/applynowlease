import express from 'express'
import bodyParser from 'body-parser'
import authenticationRoutes from 'server/routes/authentication'
import propertiesRoutes from 'server/routes/properties'
import applicationsRoutes from 'server/routes/applications'
import hellosigncallbackRoutes from 'server/routes/hellosigncallback'

const app = new express()

app.use(bodyParser.json())

app.get('/health', (req, res) => res.sendStatus(200))

app.use(
  authenticationRoutes, 
  propertiesRoutes, 
  applicationsRoutes,
  hellosigncallbackRoutes
)

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