import jwt from 'express-jwt'
import { SECRET } from './config'

const getTokenFromHeader = (req) => {
  if (
    req.headers.authorization &&
    req.headers.authorization.split(' ')[0] === 'Token'
  ) {
    return req.headers.authorization.split(' ')[1]
  }
  return null
}

export const required = jwt({
  secret: SECRET,
  getToken: getTokenFromHeader
})

export const optional = jwt({
  secret: SECRET,
  getToken: getTokenFromHeader,
  credentialsRequired: false
})