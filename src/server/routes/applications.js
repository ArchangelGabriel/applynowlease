import express from 'express'

import { STRIPE_PRIVATE_KEY } from 'server/config'

import * as auth from 'server/auth'
import { upload } from 'server/storage'
import validate from 'server/middlewares/validate'
import findModelBy from 'server/middlewares/findModelBy'
import Property from 'server/models/property'
import Application from 'server/models/application'
import Mailer, { applyToPropertyOpts } from 'server/mailer'
import { APP_URL } from 'server/config'

import {
  _attachPropertyIntermediateMiddleware,
  _attachUserIntermediateMiddleware,
  _propertyBelongsToUser,
  _attachFilesToApplication,
  _allowStatusUpdateIfAdmin,
  _allowReportUpdateIfAdmin,
  _preventDoubleCharge,
} from 'server/middlewares/intermediates'

import { 
  applyToProperty as applyToPropertyValidator,
  updateApplication as updateApplicationValidator,
} from 'server/validators/properties'

const stripe = require('stripe')(STRIPE_PRIVATE_KEY)
const router = express.Router()
const fmbPropertyIdConfig = { model: Property, by: '_id', reqAttr: 'property', from: 'params' }
const fmbAppIdConfig = { model: Application, by: '_id', reqAttr: 'application', from: 'params' }
const fmbAppConfig = { 
  model: Application, 
  where: 'property',
  by: '_id', 
  multi: true, 
  from: 'params', 
  reqAttr: 'applications' 
}

const getApplication = (req, res, next) => {
  res.json(req.application)
}

const getNonCompleteApplications = (req, res, next) => {
  Application
    .find({ user: req.user._id })
    .sort({ createdAt: -1 })
    .populate('property')
    .then(res.json.bind(res))
}

const getApplications = (req, res, next) => {
  // Think about security
  Application
    .find({})
    .populate('property')
    .then(res.json.bind(res))
}

const applyToProperty = (req, res, next) => {
  new Application(req.body)
    .save()
    .then((application) => {
      const applicationLink = (APP_URL || `${req.protocol}://${req.headers.host}`) + `/application1?property_id=${application.property}&application_id=${application._id}`
      
      Mailer.send(applyToPropertyOpts({ sender: req.user, application, applicationLink }))
      return res.json(application)
    })
    .catch(next)
}

const updatePropertyApplication = (req, res, next) => {  
  for (const attr in req.body) {
    req.application[attr] = req.body[attr]
  }
  
  req.application
  .save()
  .then(res.json.bind(res))
  .catch(next)
}

const chargePropertyApplication = (req, res, next) => {
  const amount = 4900

  stripe.charges.create({
    source: req.body.id,
    currency: 'usd',
    metadata: req.application.toStripeJSON(),
    amount: amount,
  })
  .then((charge) => {
    if (charge.status === 'succeeded') {
      req.application.charge = charge
      req.application
        .save()
        .then(res.json.bind(res))
        .catch(next)
    } else {
      console.error(charge)
      res.status(400).json({ errors: { message: 'Something wrong with payment. Try again later.' } })
    }
  })
  .catch(next)
}

const getPropertyApplications = (req, res, next) => {
  res.json(req.applications)
}

router.get('/applications/my', auth.required, getNonCompleteApplications)

router.get('/applications/:_id',
  findModelBy(Object.assign(fmbAppIdConfig, { populate: ['property'] })),
  getApplication
)

router.get('/applications', getApplications)

router.post('/properties/:_id/apply',
  auth.required,
  findModelBy(fmbPropertyIdConfig),
  _attachPropertyIntermediateMiddleware,
  _attachUserIntermediateMiddleware,
  validate(applyToPropertyValidator),
  applyToProperty
)

router.put('/properties/:property_id/applications/:_id',
  auth.optional,
  upload.fields([{ name: 'photoId', maxCount: 1 }, { name: 'payStubs', maxCount: 6 }, { name: 'finalReport', maxCount: 1 }]),
  _allowStatusUpdateIfAdmin,
  _allowReportUpdateIfAdmin,
  findModelBy(fmbAppIdConfig),
  _attachFilesToApplication,
  validate(updateApplicationValidator),
  updatePropertyApplication
)

router.post('/applications/:_id/charge',
  findModelBy(fmbAppIdConfig),
  _preventDoubleCharge,
  chargePropertyApplication
)

router.get('/properties/:_id/applications',
  auth.required,
  findModelBy(fmbPropertyIdConfig),
  _propertyBelongsToUser,
  findModelBy(fmbAppConfig),
  getPropertyApplications
)

export default router
