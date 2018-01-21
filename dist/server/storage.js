'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.upload = exports.s3 = undefined;

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _s = require('aws-sdk/clients/s3');

var _s2 = _interopRequireDefault(_s);

var _multer = require('multer');

var _multer2 = _interopRequireDefault(_multer);

var _multerS = require('multer-s3');

var _multerS2 = _interopRequireDefault(_multerS);

var _config = require('./config');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var config = {
  'development': 'dev',
  'production': 'prod',
  'testing': 'test'
};

var s3 = exports.s3 = new _s2.default();

var upload = exports.upload = (0, _multer2.default)({
  storage: (0, _multerS2.default)({
    s3: s3,
    bucket: 'applynowleases3',
    key: function key(req, file, cb) {
      var fileName = _path2.default.join('applications', req.params._id, '' + file.originalname);
      cb(null, fileName);
    }
  })
});