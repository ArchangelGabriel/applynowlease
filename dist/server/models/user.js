'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _bcrypt = require('bcrypt');

var _bcrypt2 = _interopRequireDefault(_bcrypt);

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _mongooseUniqueValidator = require('mongoose-unique-validator');

var _mongooseUniqueValidator2 = _interopRequireDefault(_mongooseUniqueValidator);

var _jsonwebtoken = require('jsonwebtoken');

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

var _config = require('../config');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var UserSchema = _mongoose2.default.Schema({
  email: {
    type: String,
    index: true,
    unique: true
  },
  password: {
    type: String
  },
  admin: {
    type: Boolean,
    default: false
  },
  firstName: String,
  lastName: String,
  city: String,
  state: String,
  zip: String,
  resetPasswordToken: String,
  resetPasswordExpires: Date
}, {
  timestamps: true
});

UserSchema.plugin(_mongooseUniqueValidator2.default, { message: '{VALUE} is already taken.' });

UserSchema.methods.generateJWT = function () {
  var today = new Date();
  var exp = new Date(today);
  exp.setDate(today.getDate() + 60);

  return _jsonwebtoken2.default.sign({
    _id: this._id,
    email: this.email,
    firstName: this.firstName,
    lastName: this.lastName,
    admin: this.admin,
    exp: parseInt(exp.getTime() / 1000, 10)
  }, _config.SECRET);
};

UserSchema.methods.toAuthJSON = function () {
  return {
    _id: this._id,
    email: this.email,
    firstName: this.firstName,
    lastName: this.lastName,
    city: this.city,
    state: this.state,
    zip: this.zip,
    token: this.generateJWT()
  };
};

UserSchema.methods.toJSON = function () {
  return {
    _id: this._id,
    email: this.email,
    firstName: this.firstName,
    lastName: this.lastName,
    city: this.city,
    state: this.state,
    zip: this.zip
  };
};

UserSchema.methods.verifyPassword = function (password) {
  return _bcrypt2.default.compare(password, this.password);
};

var User = _mongoose2.default.model('User', UserSchema);

exports.default = User;