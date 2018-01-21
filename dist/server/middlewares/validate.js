"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (check) {
  return function (req, res, next) {
    var result = check(req.body);
    if (result === true) next();else {
      var errors = {};
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = result[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var error = _step.value;

          errors[error.field] = error;
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

      res.status(400).json({ errors: errors });
    }
  };
};