import Validator from 'fastest-validator'

const v = new Validator()

export const register = v.compile({ 
  email: { type: 'email' },
  password: { type: 'string', min: 6 },
  firstName: 'string',
  lastName: 'string',
  city: 'string',
  state: 'string',
  zip: 'string'
})