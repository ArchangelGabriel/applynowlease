'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = findModelBy;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function findModelBy(_ref) {
  var model = _ref.model,
      by = _ref.by,
      where = _ref.where,
      reqAttr = _ref.reqAttr,
      _ref$from = _ref.from,
      from = _ref$from === undefined ? 'body' : _ref$from,
      _ref$multi = _ref.multi,
      multi = _ref$multi === undefined ? false : _ref$multi,
      _ref$all = _ref.all,
      all = _ref$all === undefined ? false : _ref$all,
      _ref$populate = _ref.populate,
      populate = _ref$populate === undefined ? [] : _ref$populate,
      update = _ref.update;

  where = where || by;

  return function (req, res, next) {
    var fn = multi ? 'find' : 'findOne';
    fn = update ? 'findOneAndUpdate' : fn;

    var query = all ? {} : _defineProperty({}, where, req[from][by]);

    var queryPromise = model[fn](query, update);

    if (populate.length > 0) {
      populate.forEach(function (attr) {
        return queryPromise = queryPromise.populate(attr);
      });
    }

    queryPromise.then(function (resource) {
      if (resource) {
        req[reqAttr] = resource;
        next();
      } else {
        var errors = {
          message: '' + model.modelName + (multi ? 's' : '') + ' not found.' };
        res.status(401).json({ errors: errors });
      }
    }).catch(next);
  };
}