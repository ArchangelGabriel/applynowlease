'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _bcrypt = require('bcrypt');

var _bcrypt2 = _interopRequireDefault(_bcrypt);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function hashPassword(req, res, next) {
  if (req.body.password) {
    return _bcrypt2.default.hash(req.body.password, 12).then(function (hash) {
      req.body.password = hash;
    }).then(next).catch(next);
  } else {
    next();
  }
}

exports.default = hashPassword;