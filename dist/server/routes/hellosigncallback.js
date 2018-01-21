'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _crypto = require('crypto');

var _crypto2 = _interopRequireDefault(_crypto);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _multer = require('multer');

var _multer2 = _interopRequireDefault(_multer);

var _config = require('../config');

var _application = require('../models/application');

var _application2 = _interopRequireDefault(_application);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();
var upload = (0, _multer2.default)();

router.post('/hellosigncallback', upload.any(), function (req, res) {
  var event = JSON.parse(req.body.json);

  var _event$event = event.event,
      event_time = _event$event.event_time,
      event_type = _event$event.event_type,
      event_hash = _event$event.event_hash;


  var hash = _crypto2.default.createHmac('sha256', _config.HELLO_SIGN_API_KEY).update(event_time + event_type).digest('hex').toString();

  if (event_hash === hash) {
    console.log(event);
    if (event_type === "signature_request_all_signed") {
      _application2.default.findOneAndUpdate({
        signatureRequestId: event.signature_request.signature_request_id
      }, {
        $set: { signatureRequestAllSigned: true }
      });
    }
    res.send("Hello API Event Received");
  } else {
    res.sendStatus(401);
  }
});

exports.default = router;