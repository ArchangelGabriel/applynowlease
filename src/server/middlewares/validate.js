export default function(check) {
  return function(req, res, next) {
    const result = check(req.body)
    if (result === true) next()
    else {
      const errors = {}
      for (const error of result) {
        errors[error.field] = error
      }
      res.status(400).json({ errors })
    }
  }
}