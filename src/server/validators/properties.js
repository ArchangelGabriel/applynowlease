import Validator from 'fastest-validator'

const v = new Validator()

export const addProperty = v.compile({ 
  user: 'string',
  address: {
    type: 'object',
    props: {
      streetNumber: 'string',
      street: 'string',
      city: 'string',
      state: 'string',
      country: 'string',
      zip: 'string'
    }
  },
  monthlyAsking: { type: 'number' },
  templateId: { type: 'string', optional: true }
})

export const applyToProperty = v.compile({ 
  property: 'string',
  email: 'email',
  fullName: 'string',
  phoneNumber: 'string'
})

export const updateProperty = v.compile({
  templateId: { type: 'string' }
})