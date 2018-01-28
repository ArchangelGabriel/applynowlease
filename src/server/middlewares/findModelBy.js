export default function findModelBy({ 
  model, 
  by,
  where, 
  reqAttr,
  from = 'body',
  multi = false,
  all = false,
  populate = [],
  update,
}) {
  where = where || by

  return function (req, res, next) {
    var fn = multi ? 'find' : 'findOne'
    fn = update ? 'findOneAndUpdate' : fn

    const query = all ? {} : { [where]: req[from][by] }

    let queryPromise = model[fn](query, update)

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
          res.status(404).json({ errors })
        }
      }).catch(next)
  }
}
