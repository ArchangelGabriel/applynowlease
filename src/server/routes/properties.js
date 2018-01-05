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
const fmbUserConfig = { model: Property, multi: true, where: 'user', by: 'user', reqAttr: 'properties', from: 'body' }
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
  for (const attr in req.body) {
    req.property[attr] = req.body[attr]
  }
  
  req.property
  .save()
  .then(res.json.bind(res))
  .catch(next)
}

router.get('/properties',
  auth.required, 
  _attachUserIntermediateMiddleware,
  findModelBy(fmbUserConfig),
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
