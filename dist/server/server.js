'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _herokuSslRedirect = require('heroku-ssl-redirect');

var _herokuSslRedirect2 = _interopRequireDefault(_herokuSslRedirect);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _cors = require('cors');

var _cors2 = _interopRequireDefault(_cors);

var _authentication = require('./routes/authentication');

var _authentication2 = _interopRequireDefault(_authentication);

var _properties = require('./routes/properties');

var _properties2 = _interopRequireDefault(_properties);

var _applications = require('./routes/applications');

var _applications2 = _interopRequireDefault(_applications);

var _hellosigncallback = require('./routes/hellosigncallback');

var _hellosigncallback2 = _interopRequireDefault(_hellosigncallback);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = new _express2.default();

app.use((0, _herokuSslRedirect2.default)());
app.use((0, _cors2.default)());
app.use(_bodyParser2.default.json());
app.use(_bodyParser2.default.urlencoded({ extended: false }));
app.use(_express2.default.static('src/client'));

app.get('/health', function (req, res) {
  return res.sendStatus(200);
});

app.use(_authentication2.default, _properties2.default, _applications2.default, _hellosigncallback2.default);

app.get('*', function (req, res) {
  res.sendFile(_path2.default.join(__dirname, '../client', 'index.html'));
});

app.use(function (err, req, res, next) {
  if (err.name === 'UnauthorizedError') {
    res.status(401).json({ errors: { message: err.message } });
    return;
  }

  var errors = err.errors;
  console.error(err);
  res.status(500).json({ errors: errors });
});

exports.default = app;