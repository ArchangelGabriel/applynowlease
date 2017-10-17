export default function findModelBy({ 
  model, 
  by,
  where, 
  reqAttr,
  from = 'body',
  multi = false
}) {
  where = where || by

  return function (req, res, next) {
    const fn = multi ? 'find' : 'findOne'
    model[fn]({ [where]: req[from][by] })
      .then((resource) => {
        if (resource) {
          req[reqAttr] = resource
          next()
        } else {
          const errors = { 
            message: `${model.modelName}${multi ? 's' : ''} not found.` }
          res.status(401).json({ errors })
        }
      }).catch(next)
  }
}