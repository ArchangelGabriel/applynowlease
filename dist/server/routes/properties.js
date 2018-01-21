'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _auth = require('../auth');

var auth = _interopRequireWildcard(_auth);

var _validate = require('../middlewares/validate');

var _validate2 = _interopRequireDefault(_validate);

var _findModelBy = require('../middlewares/findModelBy');

var _findModelBy2 = _interopRequireDefault(_findModelBy);

var _property = require('../models/property');

var _property2 = _interopRequireDefault(_property);

var _application = require('../models/application');

var _application2 = _interopRequireDefault(_application);

var _intermediates = require('../middlewares/intermediates');

var _properties = require('../validators/properties');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();
var fmbAllConfig = { model: _property2.default, all: true, multi: true, reqAttr: 'properties' };
var fmbUserConfig = { model: _property2.default, multi: true, where: 'user', by: 'user', reqAttr: 'properties', from: 'body' };
var fmbPropertyIdConfig = { model: _property2.default, by: '_id', reqAttr: 'property', from: 'params' };

var getProperties = function getProperties(req, res, next) {
  res.json(req.properties);
};

var addProperty = function addProperty(req, res, next) {
  new _property2.default(req.body).save().then(function (newProperty) {
    return res.json(newProperty);
  }).catch(next);
};

var updateProperty = function updateProperty(req, res, next) {
  for (var attr in req.body) {
    req.property[attr] = req.body[attr];
  }

  req.property.save().then(res.json.bind(res)).catch(next);
};

router.get('/properties', auth.required, _intermediates._attachUserIntermediateMiddleware, (0, _findModelBy2.default)(fmbUserConfig), getProperties);

router.post('/properties', auth.required, _intermediates._attachUserIntermediateMiddleware, (0, _validate2.default)(_properties.addProperty), addProperty);

router.put('/properties/:_id', auth.required, (0, _findModelBy2.default)(fmbPropertyIdConfig), _intermediates._propertyBelongsToUser, (0, _validate2.default)(_properties.updateProperty), updateProperty);

exports.default = router;