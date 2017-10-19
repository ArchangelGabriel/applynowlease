import mongoose from 'mongoose'
import Application from 'server/models/application'

const PropertySchema = mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
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
  templateId: String
}, {
  timestamps: true
})

const Property = mongoose.model('Property', PropertySchema)

export default Property