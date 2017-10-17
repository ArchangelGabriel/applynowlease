import express from 'express'

import validate from 'server/middlewares/validate'
import findModelBy from 'server/middlewares/findModelBy'
import { 
  addProperty as addPropertyValidator,
  applyToProperty as applyToPropertyValidator,
  updateProperty as updatePropertyValidator
} from 'server/validators/properties'
import Property from 'server/models/property'
import Application from 'server/models/application'
import * as auth from 'server/auth'
import extractApplicationOptions from 'server/hooks/extractApplicationOptions'

const router = express.Router()
const fmbConfig = { model: Property, by: '_id', reqAttr: 'property', from: 'params' }
const fmbAppConfig = { 
    model: Application, 
    where: 'property',
    by: '_id', 
    multi: true, 
    from: 'params', 
    reqAttr: 'applications' 
  }

const _attachUserIntermediateMiddleware = (req, res, next) => {
  req.body.user = req.user._id
  next()
}

const _attachPropertyIntermediateMiddleware = (req, res, next) => {
  req.body.property = req.property._id.toString()
  next()
}

const _propertyBelongsToUser = (req, res, next) => {
  const property = req.property
  const user = req.user

  if (property.user.toString() === user._id) {
    next()
  } else {
    const errors = { message: 'Action is unauthorized.' }
    res.status(401).json({ errors })
  }
}

const addProperty = (req, res, next) => {
  new Property(req.body)
    .save()
    .then((newProperty) => res.json(newProperty))
    .catch(next)
}

const applyToProperty = (req, res, next) => {
  new Application(req.body)
    .save()
    .then((newApplication) => {
      newApplication.requestSignature()
      res.json(newApplication)
    })
    .catch(next)
}

const getPropertyApplications = (req, res, next) => {
  res.json(Object.assign({},
    req.property.toObject(),
    { applications: req.applications }
  ))
}

const updateProperty = (req, res, next) => {
  req.property.templateId = req.body.templateId
  req.property
    .save()
    .then((updatedProperty) => res.json(updatedProperty))
}

router.post('/properties', 
  auth.required, 
  _attachUserIntermediateMiddleware,
  validate(addPropertyValidator), 
  addProperty
)

router.post('/properties/:_id/apply',
  findModelBy(fmbConfig),
  _attachPropertyIntermediateMiddleware,
  validate(applyToPropertyValidator),
  applyToProperty
)

router.get('/properties/:_id/applications',
  findModelBy(fmbConfig),
  findModelBy(fmbAppConfig),
  getPropertyApplications
)

router.put('/properties/:_id',
  auth.required,
  findModelBy(fmbConfig),
  _propertyBelongsToUser,
  validate(updatePropertyValidator),
  updateProperty
)


export default router