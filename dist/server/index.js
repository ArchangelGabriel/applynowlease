'use strict';

require('./env');

var _server = require('./server');

var _server2 = _interopRequireDefault(_server);

var _db = require('./db');

var _config = require('./config');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var db = (0, _db.connect)();

_server2.default.listen(_config.PORT, function () {
  console.log('Server is now running at PORT: ' + _config.PORT);
});