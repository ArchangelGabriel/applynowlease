import express from 'express'
import { register as registerValidator } from 'server/validators/authentication'
import hashPassword from 'server/middlewares/hashPassword'
import validate from 'server/middlewares/validate'
import findModelBy from 'server/middlewares/findModelBy'
import User from 'server/models/user'

const router = express.Router()
const fmbConfig = { model: User, by: 'email', reqAttr: 'user' }

export const register = (req, res, next) => {
  new User(req.body)
    .save()
    .then((newUser) => res.json(newUser.toAuthJSON()))
    .catch(next)
}

export const login = (req, res, next) => {
  req.user
    .verifyPassword(req.body.password)
    .then((match) => {
      if (match) res.json(req.user.toAuthJSON())
      else {
        const errors = { message: 'Credentials do not match.' }
        res.status(401).json({ errors })
      }
    })
}

router.post('/register', validate(registerValidator), hashPassword, register)

router.post('/login', findModelBy(fmbConfig), login)

export default router