'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _hellosign = require('../hellosign');

var _hellosign2 = _interopRequireDefault(_hellosign);

var _config = require('../config');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function signatureRequest(_ref) {
  var template_id = _ref.template_id,
      _ref$subject = _ref.subject,
      subject = _ref$subject === undefined ? 'Residential Lease Application' : _ref$subject,
      _ref$message = _ref.message,
      message = _ref$message === undefined ? 'Please fill.' : _ref$message,
      signers = _ref.signers;


  var opts = {
    test_mode: JSON.parse(_config.HELLO_SIGN_TEST_MODE),
    template_id: template_id,
    subject: subject,
    message: message,
    signers: signers
  };

  return _hellosign2.default.signatureRequest.sendWithTemplate(opts);
}

exports.default = signatureRequest;