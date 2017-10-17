import mongoose from 'mongoose'

import { 
  NODE_ENV, 
  MONGO_DEV_URL, 
  MONGO_TEST_URL, 
  MONGO_PROD_URL 
} from './config'

const config = {
  'development': MONGO_DEV_URL,
  'production': MONGO_PROD_URL,
  'testing': MONGO_TEST_URL
}

mongoose.Promise = Promise

export const connect = () => {
  return mongoose.connect(config[NODE_ENV], { useMongoClient: true })
}