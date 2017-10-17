import bcrypt from 'bcrypt'

function hashPassword(req, res, next) {
  if (req.body.password) {
    return bcrypt
      .hash(req.body.password, 12)
      .then((hash) => {
        req.body.password = hash
      })
      .then(next)
      .catch(next)
  } else {
    next()
  }
}

export default hashPassword