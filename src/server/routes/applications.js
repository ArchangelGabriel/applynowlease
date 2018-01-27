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
  _disallowChargeUpdate,
} from 'server/middlewares/intermediates'

import { 
  applyToProperty as applyToPropertyValidator,
  updateApplication as updateApplicationValidator,
} from 'server/validators/properties'

const stripe = require('stripe')(STRIPE_PRIVATE_KEY)
const router = express.Router()
const fmbPropertyIdConfig = { model: Property, by: '_id', reqAttr: 'property', from: 'params' }
const fmbAppIdConfig = { model: Application, by: '_id', reqAttr: 'application', from: 'params' }
const fmbAppDeclineUrlConfig = { model: Application, by: 'declineUrl', reqAttr: 'application', from: 'query' }
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
      const declineLink = `${req.protocol}://${req.headers.host}/applications/decline`

      Mailer.send(applyToPropertyOpts({
        sender: req.user,
        property: req.property,
        application,
        applicationLink,
        declineLink,
      }))
      return res.json(application)
    })
    .catch(next)
}

const declineApplication = (req, res, next) => {
  req.application.declineUrl = null
  req.application.status = 'declined'
  return req.application.save()
    .then(() => res.send("Your request has been successful. We will notify the agent about the change."))
    .catch(next)
}

const resendApplication = (req, res, next) => {
  const remind = req.query.remind

  const application = req.application
  const applicationLink = (APP_URL || `${req.protocol}://${req.headers.host}`) + `/application1?property_id=${application.property._id}&application_id=${application._id}`
  const declineLink = `${req.protocol}://${req.headers.host}/applications/decline`

  application.declineUrl = Application.generateDeclineUrl()
  application.status = remind ? 'resent' : 'sent'

  application
    .save()
    .then((application) => {
      Mailer.send(applyToPropertyOpts({
        sender: req.user,
        property: application.property,
        application,
        applicationLink,
        declineLink,
        remind,
      }))
      res.json(application)
    })
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

router.get('/applications/decline',
  findModelBy(fmbAppDeclineUrlConfig),
  declineApplication
)

router.get('/applications/:_id/resend',
  auth.required,
  findModelBy(Object.assign({}, fmbAppIdConfig, { 
    populate: ['property'], 
    update: { $inc: { resendCount: 1 } },
  })),
  resendApplication
)

router.get('/applications/:_id',
  findModelBy(Object.assign({}, fmbAppIdConfig, { populate: ['property'] })),
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
  _disallowChargeUpdate,
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
