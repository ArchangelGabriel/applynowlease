import crypto from 'crypto'
import express from 'express'
import { register as registerValidator, reset as resetValidator } from 'server/validators/authentication'
import hashPassword from 'server/middlewares/hashPassword'
import validate from 'server/middlewares/validate'
import findModelBy from 'server/middlewares/findModelBy'
import User from 'server/models/user'
import Mailer, { forgotOpts } from 'server/mailer'
import { NODE_ENV } from 'server/config'

const prod = NODE_ENV !== 'development'
const router = express.Router()
const fmbEmailConfig = { model: User, by: 'email', reqAttr: 'user' }
const fmbResetPasswordTokenConfig = { model: User, by: 'resetPasswordToken', reqAttr: 'user', from: 'params' }

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

export const forgot = (req, res, next) => {
  crypto.randomBytes(20, (err, buff) => {
    const token = buff.toString('hex')
    const resetLink = `${req.protocol}://${req.headers.host + (prod ? '' : ':3000')}/reset/${token}`

    req.user.resetPasswordToken = token
    req.user.resetPasswordExpires = Date.now() + 3600000

    req.user
      .save()
      .then((user) => {
        Mailer.send(forgotOpts({ user, resetLink }))
        res.sendStatus(200)
      })
      .catch(next)
  })
}

export const reset = (req, res, next) => {
  if (req.user.resetPasswordExpires > Date.now()) {
    req.user.password = req.body.password
    req.user.resetPasswordToken = undefined
    req.user.resetPasswordExpires = undefined

    return req.user
      .save()
      .then(() => res.redirect(req.body.redirectTo || '/'))
      .catch(next)
  }

  res.send(404)
}

router.post('/register', validate(registerValidator), hashPassword, register)

router.post('/login', findModelBy(fmbEmailConfig), login)

router.post('/forgot', findModelBy(fmbEmailConfig), forgot)

router.post('/reset/:resetPasswordToken', validate(resetValidator), hashPassword, findModelBy(fmbResetPasswordTokenConfig), reset)

export default router