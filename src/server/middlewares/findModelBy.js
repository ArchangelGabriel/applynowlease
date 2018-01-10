export default function findModelBy({ 
  model, 
  by,
  where, 
  reqAttr,
  from = 'body',
  multi = false,
  all = false,
  populate = [],
}) {
  where = where || by

  return function (req, res, next) {
    const fn = multi ? 'find' : 'findOne'
    const query = all ? {} : { [where]: req[from][by] }

    let queryPromise = model[fn](query)

    if (populate.length > 0) {
      populate.forEach((attr) => queryPromise = queryPromise.populate(attr))
    }

    queryPromise
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
