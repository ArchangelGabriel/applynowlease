export default function findModelBy({ 
  model, 
  by,
  where, 
  reqAttr,
  from = 'body',
  multi = false,
  all = false
}) {
  where = where || by

  return function (req, res, next) {
    const fn = multi ? 'find' : 'findOne'
    const query = all ? {} : { [where]: req[from][by] }

    model[fn](query)
      .then((resource) => {
        if (resource) {
          console.log(resource, query)
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
