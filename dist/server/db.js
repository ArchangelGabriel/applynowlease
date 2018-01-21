'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.connect = undefined;

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _config = require('./config');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var config = {
  'development': _config.MONGO_DEV_URL,
  'production': _config.MONGO_PROD_URL,
  'testing': _config.MONGO_TEST_URL
};

_mongoose2.default.Promise = Promise;

var connect = exports.connect = function connect() {
  return _mongoose2.default.connect(config[_config.NODE_ENV], { useMongoClient: true });
};