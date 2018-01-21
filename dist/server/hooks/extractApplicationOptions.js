'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var extractApplicationOptions = function extractApplicationOptions(application) {
  var templateId = application.property.templateId;
  if (application.property.templateId) {
    var opts = {
      template_id: templateId,
      signers: [{
        email_address: application.email,
        name: application.fullName,
        role: 'Client'
      }]
    };
    return opts;
  }
  return null;
};

exports.default = extractApplicationOptions;