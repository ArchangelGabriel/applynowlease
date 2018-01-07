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
  _propertyBelongsToUser,
  _attachFilesToApplication,
  _allowStatusUpdateIfAdmin,
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

const applyToProperty = (req, res, next) => {
  new Application(req.body)
    .save()
    .then((application) => {
      const applicationLink = (APP_URL || `${req.protocol}://${req.headers.host}`) + `/application1?property_id=${application.property}&application_id=${application._id}`
      
      Mailer.send(applyToPropertyOpts({ application, applicationLink }))
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
  const amount = 50

  stripe.charges.create({
    source: req.body.stripeToken,
    currency: 'usd',
    description: 'A sample charge.',
    amount: amount
  })
  .then((charge) => {
    res.json(charge)
  })
}

const getPropertyApplications = (req, res, next) => {
  res.json(req.applications)
}

router.post('/properties/:_id/apply',
  findModelBy(fmbPropertyIdConfig),
  _attachPropertyIntermediateMiddleware,
  validate(applyToPropertyValidator),
  applyToProperty
)

router.put('/properties/:property_id/applications/:_id',
  auth.optional,
  upload.fields([{ name: 'photoId', maxCount: 1 }, { name: 'payStubs', maxCount: 6 }]),
  _allowStatusUpdateIfAdmin,
  findModelBy(fmbAppIdConfig),
  _attachFilesToApplication,
  validate(updateApplicationValidator),
  updatePropertyApplication
)

router.post('/properties/:property_id/applications/:_id/charge',
  findModelBy(fmbAppIdConfig),
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
