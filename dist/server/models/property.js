'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _application = require('./application');

var _application2 = _interopRequireDefault(_application);

var _config = require('../config');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var PropertySchema = _mongoose2.default.Schema({
  user: {
    type: _mongoose2.default.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  addressOne: String,
  city: String,
  state: String,
  country: String,
  zip: String,
  completed: { type: Boolean, default: false },
  monthlyAsking: Number,
  templateSubject: String,
  templateDescription: String,
  templateId: {
    type: String,
    default: _config.DEFAULT_TEMPLATE_ID
  }
}, {
  timestamps: true
});

var Property = _mongoose2.default.model('Property', PropertySchema);

exports.default = Property;