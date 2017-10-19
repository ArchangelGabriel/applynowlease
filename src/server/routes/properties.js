import express from 'express'

import * as auth from 'server/auth'
import validate from 'server/middlewares/validate'
import findModelBy from 'server/middlewares/findModelBy'
import Property from 'server/models/property'
import Application from 'server/models/application'

import {
  _attachUserIntermediateMiddleware,
  _attachPropertyIntermediateMiddleware,
  _propertyBelongsToUser
} from 'server/middlewares/intermediates'

import { 
  addProperty as addPropertyValidator,
  updateProperty as updatePropertyValidator
} from 'server/validators/properties'

const router = express.Router()
const fmbAllConfig = { model: Property, all: true, multi: true, reqAttr: 'properties' }
const fmbPropertyIdConfig = { model: Property, by: '_id', reqAttr: 'property', from: 'params' }

const getProperties = (req, res, next) => {
  res.json(req.properties)
}

const addProperty = (req, res, next) => {
  new Property(req.body)
    .save()
    .then((newProperty) => res.json(newProperty))
    .catch(next)
}

const updateProperty = (req, res, next) => {
  req.property.templateId = req.body.templateId
  req.property
    .save()
    .then((updatedProperty) => res.json(updatedProperty))
}

router.get('/properties',
  findModelBy(fmbAllConfig),
  getProperties
)

router.post('/properties', 
  auth.required, 
  _attachUserIntermediateMiddleware,
  validate(addPropertyValidator), 
  addProperty
)

router.put('/properties/:_id',
  auth.required,
  findModelBy(fmbPropertyIdConfig),
  _propertyBelongsToUser,
  validate(updatePropertyValidator),
  updateProperty
)

export default router
