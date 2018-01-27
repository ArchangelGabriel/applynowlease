'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _randToken = require('rand-token');

var _randToken2 = _interopRequireDefault(_randToken);

var _requestSignature = require('../hooks/requestSignature');

var _requestSignature2 = _interopRequireDefault(_requestSignature);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ChargeSchema = _mongoose2.default.Schema({}, { strict: false, _id: false });

var SignerSchema = _mongoose2.default.Schema({
  email: String,
  fullName: String,
  phoneNumber: String,
  role: String
}, {
  _id: false
});

var ApplicationSchema = _mongoose2.default.Schema({
  user: {
    type: _mongoose2.default.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  property: {
    type: _mongoose2.default.Schema.Types.ObjectId,
    ref: 'Property',
    required: true
  },
  applicantName: String,
  email: String,
  employmentStatus: { type: String, enum: ['fulltime', 'parttime', 'selfemployed', 'unemployed'] },
  photoId: [String],
  payStubs: [String],
  finalReport: [String],
  status: { type: String, enum: ['sent', 'resent', 'declined', 'opened', 'viewed', 'pending', 'completed'], default: 'sent' },
  charge: ChargeSchema,
  declineUrl: { type: String, default: function _default() {
      return _randToken2.default.generate(16);
    }, index: true },
  resendCount: { type: Number, default: 0 }
}, {
  timestamps: true
});

ApplicationSchema.statics.generateDeclineUrl = function () {
  return _randToken2.default.generate(16);
};

ApplicationSchema.methods.requestSignature = function (cb) {
  this.populate('property', function (err, application) {
    if (err) return console.error(err);
    var opts = extractOptions(application);
    if (opts) {
      (0, _requestSignature2.default)(opts).then(application.saveRequestSignatureResult.bind(application)).then(function (savedApplication) {
        cb(null, savedApplication);
      }).catch(cb);
    } else {
      cb(null, application);
    }
  });
};

ApplicationSchema.methods.saveRequestSignatureResult = function (signatureResult) {
  if (signatureResult.statusCode === 200) {
    var signatureRequestId = signatureResult.signature_request.signature_request_id;
    this.signatureRequestId = signatureRequestId;
    return this.save();
  } else {
    console.error(signatureResult);
  }
};

ApplicationSchema.methods.toStripeJSON = function () {
  return {
    _id: this.id.toString(),
    user: this.user.toString(),
    property: this.property.toString(),
    applicantName: this.applicantName
  };
};

var extractOptions = function extractOptions(application) {
  var templateId = application.property.templateId;
  if (templateId) {
    var opts = {
      template_id: templateId,
      signers: application.signers.map(function (signer) {
        return {
          email_address: signer.email,
          name: signer.fullName,
          role: signer.role
        };
      })
    };
    return opts;
  }
  return null;
};

var Application = _mongoose2.default.model('Application', ApplicationSchema);

exports.default = Application;