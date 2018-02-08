import path from 'path'
import keystone from 'keystone'
import server from './server'

import {
  PORT,
  SECRET,
  NODE_ENV,
  MONGO_DEV_URL, 
  MONGO_TEST_URL, 
  MONGO_PROD_URL,  
} from './config'

const config = {
  'development': MONGO_DEV_URL,
  'production': MONGO_PROD_URL,
  'testing': MONGO_TEST_URL
}

keystone.init({
  'env': NODE_ENV,
  'mongo': config[NODE_ENV],

  'name': 'Apply Now Leasing',

  'auto update': true,
  'session': true,
  'session store': 'mongo',
  'auth': true,
  'user model': 'User',
})

keystone.import('models')
server.use('/keystone', require('keystone/admin/server/app/createStaticRouter.js')(keystone))
server.use('/keystone', require('keystone/admin/server/app/createDynamicRouter.js')(keystone))

server.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client', 'index.html'))
})

server.use(function (err, req, res, next) {
  if (err.name === 'UnauthorizedError') {
    res.status(401).json({ errors: { message: err.message } })
    return 
  }

  const errors = err.errors
  console.error(err)
  res.status(500).json({ errors })
})

keystone.app = server
keystone.start()