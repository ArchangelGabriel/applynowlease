import Validator from 'fastest-validator'

const v = new Validator()

export const addProperty = v.compile({ 
  user: 'string',
  addressOne: { type: 'string' },
  city: { type: 'string' },
  state: { type: 'string' },
  country: { type: 'string' },
  zip: { type: 'string' },
  address: {
    type: 'object',
    props: {
      streetNumber: 'string',
      street: 'string',
      city: 'string',
      state: 'string',
      country: 'string',
      zip: 'string'
    },
    optional: true,
  },
  monthlyAsking: { type: 'number' },
  templateSubject: { type: 'string', optional: true },
  templateDescription: { type: 'string', optional: true },
  templateId: { type: 'string', optional: true },
})

export const applyToProperty = v.compile({ 
  property: 'string',
  applicantName: 'string',
})

export const updateProperty = v.compile({
  addressOne: { type: 'string', optional: true },
  city: { type: 'string', optional: true },
  state: { type: 'string', optional: true },
  country: { type: 'string', optional: true },
  zip: { type: 'string', optional: true },
  address: {
    type: 'object',
    props: {
      streetNumber: 'string',
      street: 'string',
      city: 'string',
      state: 'string',
      country: 'string',
      zip: 'string',
    },
    optional: true,
  },
  monthlyAsking: { type: 'number', optional: true },
})

export const updateApplication = v.compile({
  applicantName: { type: 'string', optional: true },
  status: { type: 'string', enum: ['sent', 'opened', 'viewed', 'pending', 'completed'], optional: true },
})