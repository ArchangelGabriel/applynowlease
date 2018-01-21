'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.applyToPropertyOpts = exports.forgotOpts = undefined;

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

var applyToPropertyOpts = exports.applyToPropertyOpts = function applyToPropertyOpts(_ref2) {
  var sender = _ref2.sender,
      application = _ref2.application,
      applicationLink = _ref2.applicationLink;
  return {
    to: application.email,
    from: 'donotreply@applynowleasing.com',
    subject: '[Action Required] Fill Up Credit/Background Check Documents',
    text: '\n    ' + (sender.firstName && sender.lastname && sender.firstName + ' ' + sender.lastName || sender.email) + ' has requested you fill up this form:\n    ' + applicationLink + '\n  '
  };
};

exports.default = _mail2.default;