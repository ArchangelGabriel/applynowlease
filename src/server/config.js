export const SECRET = process.env.SECRET || 'supersecurestring'
export const NODE_ENV = process.env.NODE_ENV || 'development'
export const MONGO_DEV_URL = process.env.MONGO_DEV_URL || 'mongodb://localhost/ApplyNowLease_dev'
export const MONGO_TEST_URL = process.env.MONGO_TEST_URL || 'mongodb://localhost/ApplyNowLease_test'
export const MONGO_PROD_URL = process.env.MONGO_PROD_URL || 'mongodb://localhost/ApplyNowLease_prod'
export const HELLO_SIGN_API_KEY = process.env.HELLO_SIGN_API_KEY
export const STRIPE_PUBLIC_KEY = process.env.STRIPE_PUBLIC_KEY
export const STRIPE_PRIVATE_KEY = process.env.STRIPE_PRIVATE_KEY