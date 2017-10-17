import mongoose from 'mongoose'

const ApplicationSchema = mongoose.Schema({
  property: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Property', 
    required: true 
  },
  email: String,
  fullName: String,
  phoneNumber: String
}, {
  timestamps: true
})

ApplicationSchema.post('save', function(doc) {
  console.log(doc)
})

const Application = mongoose.model('Application', ApplicationSchema)

export default Application