import mongoose from 'mongoose'
import Application from 'server/models/application'
import { DEFAULT_TEMPLATE_ID } from '../config'

const PropertySchema = mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  addressOne: String,
  city: String,
  state: String,
  country: String,
  zip: String,
  address: {
    streetNumber: String,
    street: String,
    city: String,
    state: String,
    country: String,
    zip: String
  },
  monthlyAsking: Number,
  templateSubject: String,
  templateDescription: String,
  templateId: {
    type: String,
    default: DEFAULT_TEMPLATE_ID
  }
}, {
  timestamps: true
})

const Property = mongoose.model('Property', PropertySchema)

export default Property