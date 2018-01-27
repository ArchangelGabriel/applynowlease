'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.applyToPropertyOpts = exports.applyToPropertyOpts2 = exports.forgotOpts = undefined;

var _timeAgo = require('time-ago');

var _timeAgo2 = _interopRequireDefault(_timeAgo);

var _config = require('./config');

var _mail = require('@sendgrid/mail');

var _mail2 = _interopRequireDefault(_mail);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_mail2.default.setApiKey(_config.SENDGRID_API_KEY);

var forgotOpts = exports.forgotOpts = function forgotOpts(_ref) {
  var user = _ref.user,
      resetLink = _ref.resetLink;
  return {
    to: user.email,
    from: 'donotreploy@applynowleasing.com',
    subject: '[Action Required] Reset Password',
    text: '\n    You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n\n    Please click on the following link, or paste this into your browser to complete the process:\n\n    ' + resetLink + '\n\n\n    If you did not request this, please ignore this email and your password will remain unchanged.\n  '
  };
};

var applyToPropertyOpts2 = exports.applyToPropertyOpts2 = function applyToPropertyOpts2(_ref2) {
  var sender = _ref2.sender,
      application = _ref2.application,
      applicationLink = _ref2.applicationLink;
  return {
    to: application.email,
    from: 'donotreply@applynowleasing.com',
    subject: '[Action Required] Fill Up Credit/Background Check Documents',
    text: '\n    ' + (sender.firstName && sender.lastName && sender.firstName + ' ' + sender.lastName || sender.email) + ' has requested you fill up this form:\n    ' + applicationLink + '\n  '
  };
};

var applyToPropertyOpts = exports.applyToPropertyOpts = function applyToPropertyOpts(_ref3) {
  var remind = _ref3.remind,
      sender = _ref3.sender,
      property = _ref3.property,
      application = _ref3.application,
      applicationLink = _ref3.applicationLink,
      declineLink = _ref3.declineLink;
  return {
    substitutionWrappers: ['<%', '%>'],
    from: {
      email: 'applications@applynowleasing.com',
      name: 'ApplyNowLeasing'
    },
    to: application.email,
    subject: 'Lease Application Form ' + (remind ? 'Reminder' : 'Request'),
    templateId: '8213f595-e82a-428a-a220-3498142e528d',
    substitutions: {
      recipient: application.applicantName,
      sender: sender.firstName && sender.lastName && sender.firstName + ' ' + sender.lastName || sender.email,
      address: property.addressOne,
      price: property.monthlyAsking,
      application_url: applicationLink,
      decline_url: declineLink + '?declineUrl=' + application.declineUrl,
      remind: remind ? 'Just a reminder, ' : '',
      remind_ago: remind ? ' created ' + _timeAgo2.default.ago(application.createdAt) : ''
    }
  };
};

exports.default = _mail2.default;