import Validator from 'fastest-validator'

const v = new Validator()

export const addProperty = v.compile({ 
  user: 'string',
  addressOne: { type: 'string' },
  city: { type: 'string' },
  state: { type: 'string' },
  country: { type: 'string' },
  zip: { type: 'string' },
  monthlyAsking: { type: 'number' },
  templateSubject: { type: 'string', optional: true },
  templateDescription: { type: 'string', optional: true },
  templateId: { type: 'string', optional: true },
})

export const applyToProperty = v.compile({ 
  property: 'string',
  applicantName: 'string',
  email: 'email',
})

export const updateProperty = v.compile({
  addressOne: { type: 'string', optional: true },
  city: { type: 'string', optional: true },
  state: { type: 'string', optional: true },
  country: { type: 'string', optional: true },
  zip: { type: 'string', optional: true },
  completed: { type: 'boolean', optional: true },
  monthlyAsking: { type: 'number', optional: true },
})

export const updateApplication = v.compile({
  employmentStatus: 'string',
  photoId: { type: 'array', items: 'string' },
  payStubs: { type: 'array', items: 'string' },
  status: { type: 'string', enum: ['sent', 'opened', 'viewed', 'pending', 'completed'], optional: true },
})