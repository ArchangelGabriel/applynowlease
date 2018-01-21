'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.reset = exports.forgot = exports.login = exports.register = undefined;

var _crypto = require('crypto');

var _crypto2 = _interopRequireDefault(_crypto);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _authentication = require('../validators/authentication');

var _hashPassword = require('../middlewares/hashPassword');

var _hashPassword2 = _interopRequireDefault(_hashPassword);

var _validate = require('../middlewares/validate');

var _validate2 = _interopRequireDefault(_validate);

var _findModelBy = require('../middlewares/findModelBy');

var _findModelBy2 = _interopRequireDefault(_findModelBy);

var _user = require('../models/user');

var _user2 = _interopRequireDefault(_user);

var _mailer = require('../mailer');

var _mailer2 = _interopRequireDefault(_mailer);

var _config = require('../config');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();
var fmbEmailConfig = { model: _user2.default, by: 'email', reqAttr: 'user' };
var fmbResetPasswordTokenConfig = { model: _user2.default, by: 'resetPasswordToken', reqAttr: 'user', from: 'params' };

var register = exports.register = function register(req, res, next) {
  new _user2.default(req.body).save().then(function (newUser) {
    return res.json(newUser.toAuthJSON());
  }).catch(next);
};

var login = exports.login = function login(req, res, next) {
  req.user.verifyPassword(req.body.password).then(function (match) {
    if (match) res.json(req.user.toAuthJSON());else {
      var errors = { message: 'Credentials do not match.' };
      res.status(401).json({ errors: errors });
    }
  });
};

var forgot = exports.forgot = function forgot(req, res, next) {
  _crypto2.default.randomBytes(20, function (err, buff) {
    var token = buff.toString('hex');
    var resetLink = (_config.APP_URL || req.protocol + '://' + req.headers.host) + ('/reset/' + token);

    req.user.resetPasswordToken = token;
    req.user.resetPasswordExpires = Date.now() + 3600000;

    req.user.save().then(function (user) {
      _mailer2.default.send((0, _mailer.forgotOpts)({ user: user, resetLink: resetLink }));
      res.json({});
    }).catch(next);
  });
};

var reset = exports.reset = function reset(req, res, next) {
  if (req.user.resetPasswordExpires > Date.now()) {
    req.user.password = req.body.password;
    req.user.resetPasswordToken = undefined;
    req.user.resetPasswordExpires = undefined;

    return req.user.save().then(function () {
      return res.json({});
    }).catch(next);
  }

  res.send(404);
};

router.post('/register', (0, _validate2.default)(_authentication.register), _hashPassword2.default, register);

router.post('/login', (0, _findModelBy2.default)(fmbEmailConfig), login);

router.post('/forgot', (0, _findModelBy2.default)(fmbEmailConfig), forgot);

router.post('/reset/:resetPasswordToken', (0, _validate2.default)(_authentication.reset), _hashPassword2.default, (0, _findModelBy2.default)(fmbResetPasswordTokenConfig), reset);

exports.default = router;