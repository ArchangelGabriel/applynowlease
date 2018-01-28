import mongoose from 'mongoose'
import randtoken from 'rand-token'

import requestSignature from 'server/hooks/requestSignature'

const ChargeSchema = mongoose.Schema({}, { strict: false, _id: false })

const SignerSchema = mongoose.Schema({
  email: String,
  fullName: String,
  phoneNumber: String,
  role: String
}, {
  _id: false
})

const ApplicationSchema = mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true
  },
  property: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Property', 
    required: true
  },
  applicantName: String,
  email: String,
  employmentStatus: { type: String, enum: ['fulltime', 'parttime', 'selfemployed', 'unemployed'] },
  photoId: [String],
  payStubs: [String],
  finalReport: [String],
  status: { type: String, enum: ['sent', 'resent', 'declined', 'opened', 'dropped', 'viewed', 'pending', 'completed'], default: 'sent' },
  charge: ChargeSchema,
  declineUrl: { type: String, default: () => randtoken.generate(16), index: true },
  resendCount: { type: Number, default: 0 }
}, {
  timestamps: true
})

ApplicationSchema.statics.generateDeclineUrl = function() {
  return randtoken.generate(16)
}

ApplicationSchema.methods.requestSignature = function(cb) {
  this.populate('property', function(err, application) {
    if (err) return console.error(err)
    const opts = extractOptions(application)
    if (opts) {
      requestSignature(opts)
        .then(application.saveRequestSignatureResult.bind(application))
        .then((savedApplication) => { cb(null, savedApplication) })
        .catch(cb)
    } else {
      cb(null, application)
    }
  })
}

ApplicationSchema.methods.saveRequestSignatureResult = function(signatureResult) {
  if (signatureResult.statusCode === 200) {
    const signatureRequestId = signatureResult.signature_request.signature_request_id
    this.signatureRequestId = signatureRequestId
    return this.save()
  } else {
    console.error(signatureResult)
  }
}

ApplicationSchema.methods.toStripeJSON = function() {
  return {
    _id: this.id.toString(),
    user: this.user.toString(),
    property: this.property.toString(),
    applicantName: this.applicantName,
  }
}

const extractOptions = (application) => {
  const templateId = application.property.templateId
  if (templateId) {
    let opts = {
      template_id: templateId,
      signers: application.signers.map(signer => ({
        email_address: signer.email,
        name: signer.fullName,
        role: signer.role
      }))
    }
    return opts
  }
  return null
}

const Application = mongoose.model('Application', ApplicationSchema)

export default Application