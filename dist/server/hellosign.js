'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _hellosignSdk = require('hellosign-sdk');

var _hellosignSdk2 = _interopRequireDefault(_hellosignSdk);

var _config = require('./config');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var hellosign = (0, _hellosignSdk2.default)({ key: _config.HELLO_SIGN_API_KEY });

exports.default = hellosign;