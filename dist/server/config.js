'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var PORT = exports.PORT = process.env.PORT || 3000;
var SECRET = exports.SECRET = process.env.SECRET || 'supersecurestring';
var NODE_ENV = exports.NODE_ENV = process.env.NODE_ENV || 'development';
var MONGO_DEV_URL = exports.MONGO_DEV_URL = process.env.MONGO_DEV_URL || 'mongodb://localhost/ApplyNowLease_dev';
var MONGO_TEST_URL = exports.MONGO_TEST_URL = process.env.MONGO_TEST_URL || 'mongodb://localhost/ApplyNowLease_test';
var MONGO_PROD_URL = exports.MONGO_PROD_URL = process.env.MONGO_PROD_URL || 'mongodb://localhost/ApplyNowLease_prod';
var HELLO_SIGN_API_KEY = exports.HELLO_SIGN_API_KEY = process.env.HELLO_SIGN_API_KEY;
var HELLO_SIGN_TEST_MODE = exports.HELLO_SIGN_TEST_MODE = process.env.HELLO_SIGN_TEST_MODE;
var STRIPE_PUBLIC_KEY = exports.STRIPE_PUBLIC_KEY = process.env.STRIPE_PUBLIC_KEY;
var STRIPE_PRIVATE_KEY = exports.STRIPE_PRIVATE_KEY = process.env.STRIPE_PRIVATE_KEY;
var DEFAULT_TEMPLATE_ID = exports.DEFAULT_TEMPLATE_ID = process.env.DEFAULT_TEMPLATE_ID;
var SENDGRID_API_KEY = exports.SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
var APP_URL = exports.APP_URL = process.env.APP_URL;