'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _config = require('../config');

var _auth = require('../auth');

var auth = _interopRequireWildcard(_auth);

var _storage = require('../storage');

var _validate = require('../middlewares/validate');

var _validate2 = _interopRequireDefault(_validate);

var _findModelBy = require('../middlewares/findModelBy');

var _findModelBy2 = _interopRequireDefault(_findModelBy);

var _property = require('../models/property');

var _property2 = _interopRequireDefault(_property);

var _application = require('../models/application');

var _application2 = _interopRequireDefault(_application);

var _mailer = require('../mailer');

var _mailer2 = _interopRequireDefault(_mailer);

var _intermediates = require('../middlewares/intermediates');

var _properties = require('../validators/properties');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var stripe = require('stripe')(_config.STRIPE_PRIVATE_KEY);
var router = _express2.default.Router();
var fmbPropertyIdConfig = { model: _property2.default, by: '_id', reqAttr: 'property', from: 'params' };
var fmbAppIdConfig = { model: _application2.default, by: '_id', reqAttr: 'application', from: 'params' };
var fmbAppConfig = {
  model: _application2.default,
  where: 'property',
  by: '_id',
  multi: true,
  from: 'params',
  reqAttr: 'applications'
};

var getApplication = function getApplication(req, res, next) {
  res.json(req.application);
};

var getNonCompleteApplications = function getNonCompleteApplications(req, res, next) {
  _application2.default.find({ user: req.user._id }).sort({ createdAt: -1 }).populate('property').then(res.json.bind(res));
};

var getApplications = function getApplications(req, res, next) {
  // Think about security
  _application2.default.find({}).populate('property').then(res.json.bind(res));
};

var applyToProperty = function applyToProperty(req, res, next) {
  new _application2.default(req.body).save().then(function (application) {
    var applicationLink = (_config.APP_URL || req.protocol + '://' + req.headers.host) + ('/application1?property_id=' + application.property + '&application_id=' + application._id);

    _mailer2.default.send((0, _mailer.applyToPropertyOpts)({ sender: req.user, application: application, applicationLink: applicationLink }));
    return res.json(application);
  }).catch(next);
};

var updatePropertyApplication = function updatePropertyApplication(req, res, next) {
  for (var attr in req.body) {
    req.application[attr] = req.body[attr];
  }

  req.application.save().then(res.json.bind(res)).catch(next);
};

var chargePropertyApplication = function chargePropertyApplication(req, res, next) {
  var amount = 5000;

  stripe.charges.create({
    source: req.body.id,
    currency: 'usd',
    metadata: req.application.toStripeJSON(),
    amount: amount
  }).then(function (charge) {
    if (charge.status === 'succeeded') {
      req.application.charge = charge;
      req.application.save().then(res.json.bind(res)).catch(next);
    } else {
      console.error(charge);
      res.status(400).json({ errors: { message: 'Something wrong with payment. Try again later.' } });
    }
  }).catch(next);
};

var getPropertyApplications = function getPropertyApplications(req, res, next) {
  res.json(req.applications);
};

router.get('/applications/my', auth.required, getNonCompleteApplications);

router.get('/applications/:_id', (0, _findModelBy2.default)(Object.assign(fmbAppIdConfig, { populate: ['property'] })), getApplication);

router.get('/applications', getApplications);

router.post('/properties/:_id/apply', auth.required, (0, _findModelBy2.default)(fmbPropertyIdConfig), _intermediates._attachPropertyIntermediateMiddleware, _intermediates._attachUserIntermediateMiddleware, (0, _validate2.default)(_properties.applyToProperty), applyToProperty);

router.put('/properties/:property_id/applications/:_id', auth.optional, _storage.upload.fields([{ name: 'photoId', maxCount: 1 }, { name: 'payStubs', maxCount: 6 }, { name: 'finalReport', maxCount: 1 }]), _intermediates._allowStatusUpdateIfAdmin, _intermediates._allowReportUpdateIfAdmin, (0, _findModelBy2.default)(fmbAppIdConfig), _intermediates._attachFilesToApplication, (0, _validate2.default)(_properties.updateApplication), updatePropertyApplication);

router.post('/applications/:_id/charge', (0, _findModelBy2.default)(fmbAppIdConfig), _intermediates._preventDoubleCharge, chargePropertyApplication);

router.get('/properties/:_id/applications', auth.required, (0, _findModelBy2.default)(fmbPropertyIdConfig), _intermediates._propertyBelongsToUser, (0, _findModelBy2.default)(fmbAppConfig), getPropertyApplications);

exports.default = router;