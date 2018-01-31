'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _disallowChargeUpdate = exports._disallowChargeUpdate = function _disallowChargeUpdate(req, res, next) {
  if ('charge' in req.body) {
    return res.sendStatus(401);
  }
  next();
};

var _allowStatusUpdateIfAdmin = exports._allowStatusUpdateIfAdmin = function _allowStatusUpdateIfAdmin(req, res, next) {
  if (req.body.status) {
    if (req.user && req.user.admin) {
      return next();
    } else {
      return res.sendStatus(401);
    }
  }
  next();
};

var _allowReportUpdateIfAdmin = exports._allowReportUpdateIfAdmin = function _allowReportUpdateIfAdmin(req, res, next) {
  if (req.files && req.files.finalReport) {
    if (req.user && req.user.admin) {
      return next();
    } else {
      return res.sendStatus(401);
    }
  }
  next();
};

var _attachFilesToApplication = exports._attachFilesToApplication = function _attachFilesToApplication(req, res, next) {
  var toBeAttached = {};
  for (var fileName in req.files) {
    var files = req.files[fileName];
    toBeAttached[fileName] = [];
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = files[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var file = _step.value;

        toBeAttached[fileName].push(file.location);
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator.return) {
          _iterator.return();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }
  }
  Object.assign(req.body, toBeAttached);
  next();
};

var _attachPropertyIntermediateMiddleware = exports._attachPropertyIntermediateMiddleware = function _attachPropertyIntermediateMiddleware(req, res, next) {
  req.body.property = req.property._id.toString();
  next();
};

var _attachUserIntermediateMiddleware = exports._attachUserIntermediateMiddleware = function _attachUserIntermediateMiddleware(req, res, next) {
  req.body.user = req.user._id;
  next();
};

var _propertyBelongsToUser = exports._propertyBelongsToUser = function _propertyBelongsToUser(req, res, next) {
  var property = req.property;
  var user = req.user;

  if (property.user.toString() === user._id) {
    next();
  } else {
    var errors = { message: 'Action is unauthorized.' };
    res.status(401).json({ errors: errors });
  }
};

var _preventDoubleCharge = exports._preventDoubleCharge = function _preventDoubleCharge(req, res, next) {
  if (req.application.charge && req.application.charge.toObject().status === 'succeeded') {
    var errors = { message: 'Application has already been paid. No charge was made.' };
    return res.status(400).json({ errors: errors });
  }
  next();
};