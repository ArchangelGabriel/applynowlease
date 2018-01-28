"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var allowResendIfOwnerOrAdmin = function allowResendIfOwnerOrAdmin(req, res, next) {
  if (req.user.admin || req.application.user._id.toString() === req.user._id) {
    next();
  } else {
    return res.sendStatus(401);
  }
};

exports.default = allowResendIfOwnerOrAdmin;