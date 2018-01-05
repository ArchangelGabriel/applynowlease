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
  templateSubject: { type: 'string', optional: true },
  templateDescription: { type: 'string', optional: true },
  templateId: { type: 'string', optional: true }
})

export const applyToProperty = v.compile({ 
  property: 'string',
  applicantName: 'string',
  status: { type: 'string', enum: ['sent', 'opened', 'viewed', 'pending', 'completed'] }
  // signers: { 
  //   type: "array", 
  //   min: 2, 
  //   items: {
  //     type: "object",
  //     props: {
  //       email: 'email',
  //       fullName: 'string',
  //       phoneNumber: 'string',
  //       role: { type: 'string', enum: ['Agent', 'Client'] }
  //     }
  //   }
  // },
  // payerEmail: { type: 'string', optional: true }
})

export const updateProperty = v.compile({
  applicantName: { type: 'string', optional: true },
  status: { type: 'string', enum: ['sent', 'opened', 'viewed', 'pending', 'completed'], optional: true },
  // templateId: { type: 'string' },
})