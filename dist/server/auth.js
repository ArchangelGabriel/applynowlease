'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.optional = exports.required = undefined;

var _expressJwt = require('express-jwt');

var _expressJwt2 = _interopRequireDefault(_expressJwt);

var _config = require('./config');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var getTokenFromHeader = function getTokenFromHeader(req) {
  if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Token') {
    return req.headers.authorization.split(' ')[1];
  }
  return null;
};

var required = exports.required = (0, _expressJwt2.default)({
  secret: _config.SECRET,
  getToken: getTokenFromHeader
});

var optional = exports.optional = (0, _expressJwt2.default)({
  secret: _config.SECRET,
  getToken: getTokenFromHeader,
  credentialsRequired: false
});