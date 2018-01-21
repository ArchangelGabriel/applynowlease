'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.reset = exports.register = undefined;

var _fastestValidator = require('fastest-validator');

var _fastestValidator2 = _interopRequireDefault(_fastestValidator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var v = new _fastestValidator2.default();

var register = exports.register = v.compile({
  email: { type: 'email' },
  password: { type: 'string', min: 6 },
  firstName: 'string',
  lastName: 'string',
  city: 'string',
  state: 'string',
  zip: 'string'
});

var reset = exports.reset = v.compile({
  password: { type: 'string', min: 6 }
});