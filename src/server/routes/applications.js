import express from 'express'

import { STRIPE_PRIVATE_KEY } from 'server/config'

import * as auth from 'server/auth'
import { upload } from 'server/storage'
import validate from 'server/middlewares/validate'
import findModelBy from 'server/middlewares/findModelBy'
import Property from 'server/models/property'
import Application from 'server/models/application'

import {
  _attachPropertyIntermediateMiddleware,
  _propertyBelongsToUser
} from 'server/middlewares/intermediates'

import { 
  applyToProperty as applyToPropertyValidator,
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
    .then((newApplication) => {
      newApplication.requestSignature((err, savedApplication) => {
        if (err) return next(err)
        res.json(savedApplication)
      })
    })
    .catch(next)
}

const updatePropertyApplication = (req, res, next) => {
  // console.log(req.application)
  console.log(req.files)
  res.sendStatus(200)
  // req.property.templateId = req.body.templateId
  // req.property
  //   .save()
  //   .then((updatedProperty) => res.json(updatedProperty))
}

const chargePropertyApplication = (req, res, next) => {
  console.log(req)
  // find the application
  // extract out the number of going to be tenants
  // if age is an adult, calculate the amount needed to be paid
  
  const amount = 500

  stripe.charges.create({
    source: req.body.stripeToken,
    currency: 'usd',
    description: 'A sample charge.',
    amount: amount + 1
  })
  .then((charge) => {
    res.json(charge)
  })
}

const getPropertyApplications = (req, res, next) => {
  res.json(Object.assign({},
    req.property.toObject(),
    { applications: req.applications }
  ))
}

router.post('/properties/:_id/apply',
  findModelBy(fmbPropertyIdConfig),
  _attachPropertyIntermediateMiddleware,
  validate(applyToPropertyValidator),
  applyToProperty
)

router.put('/properties/:property_id/applications/:_id',
  upload.array('supportingDocuments'),
  findModelBy(fmbAppIdConfig),
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
