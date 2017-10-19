import express from 'express'

import * as auth from 'server/auth'
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

const router = express.Router()
const fmbPropertyIdConfig = { model: Property, by: '_id', reqAttr: 'property', from: 'params' }
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

router.get('/properties/:_id/applications',
  auth.required,
  findModelBy(fmbPropertyIdConfig),
  _propertyBelongsToUser,
  findModelBy(fmbAppConfig),
  getPropertyApplications
)

export default router
