import mongoose from 'mongoose'

import requestSignature from 'server/hooks/requestSignature'

const SignerSchema = mongoose.Schema({
  email: String,
  fullName: String,
  phoneNumber: String,
  role: String
}, {
  _id: false
})

const ApplicationSchema = mongoose.Schema({
  property: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Property', 
    required: true
  },
  signers: [SignerSchema],
  payerEmail: String,
  readyForPayment: { type: Boolean, default: false },
  signatureRequestId: String
}, {
  timestamps: true
})

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