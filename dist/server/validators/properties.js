'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateApplication = exports.updateProperty = exports.applyToProperty = exports.addProperty = undefined;

var _fastestValidator = require('fastest-validator');

var _fastestValidator2 = _interopRequireDefault(_fastestValidator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var v = new _fastestValidator2.default();

var addProperty = exports.addProperty = v.compile({
  user: 'string',
  addressOne: { type: 'string' },
  city: { type: 'string' },
  state: { type: 'string' },
  country: { type: 'string' },
  zip: { type: 'string' },
  monthlyAsking: { type: 'number' },
  templateSubject: { type: 'string', optional: true },
  templateDescription: { type: 'string', optional: true },
  templateId: { type: 'string', optional: true }
});

var applyToProperty = exports.applyToProperty = v.compile({
  property: 'string',
  applicantName: 'string',
  email: 'email'
});

var updateProperty = exports.updateProperty = v.compile({
  addressOne: { type: 'string', optional: true },
  city: { type: 'string', optional: true },
  state: { type: 'string', optional: true },
  country: { type: 'string', optional: true },
  zip: { type: 'string', optional: true },
  completed: { type: 'boolean', optional: true },
  monthlyAsking: { type: 'number', optional: true }
});

var updateApplication = exports.updateApplication = v.compile({
  employmentStatus: { type: 'string', optional: true },
  photoId: { type: 'array', items: 'string', optional: true },
  payStubs: { type: 'array', items: 'string', optional: true },
  finalReport: { type: 'array', items: 'string', optional: true },
  status: { type: 'string', enum: ['sent', 'opened', 'viewed', 'pending', 'completed'], optional: true }
});