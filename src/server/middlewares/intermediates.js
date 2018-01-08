const R = require('ramda')

export const _allowStatusUpdateIfAdmin = (req, res, next) => {
  if (req.body.status) {
    if (req.user && req.user.admin) {
      next()
    } else {
      return res.sendStatus(401)
    }
  }
  next()
}

export const _attachFilesToApplication = (req, res, next) => {
  Object.assign(req.body, R.map(R.map(R.prop('location')))(req.files))
  next()
}

export const _attachUserIntermediateMiddleware = (req, res, next) => {
  req.body.user = req.user._id
  next()
}

export const _attachPropertyIntermediateMiddleware = (req, res, next) => {
  req.body.property = req.property._id.toString()
  next()
}

export const _propertyBelongsToUser = (req, res, next) => {
  const property = req.property
  const user = req.user

  if (property.user.toString() === user._id) {
    next()
  } else {
    const errors = { message: 'Action is unauthorized.' }
    res.status(401).json({ errors })
  }
}