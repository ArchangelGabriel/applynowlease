import bcrypt from 'bcrypt'
import mongoose from 'mongoose'
import uniqueValidator from 'mongoose-unique-validator'
import jwt from 'jsonwebtoken'

import { SECRET } from '../config'

const UserSchema = mongoose.Schema({
  email: { 
    type: String, 
    index: true,
    unique: true
  },
  password: {
    type: String
  }
}, {
  timestamps: true
})

UserSchema.plugin(uniqueValidator, {message: '{VALUE} is already taken.'})


UserSchema.methods.generateJWT = function() {
  const today = new Date()
  const exp = new Date(today)
  exp.setDate(today.getDate() + 60)

  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      exp: parseInt(exp.getTime() / 1000, 10),
    },
    SECRET,
  )
}

UserSchema.methods.toAuthJSON = function() {
  return {
    _id: this._id,
    email: this.email,
    token: this.generateJWT()
  }
}

UserSchema.methods.toJSON = function() {
  return {
    _id: this._id,
    email: this.email
  }
}

UserSchema.methods.verifyPassword = function(password) {
  return bcrypt
    .compare(password, this.password)
}

const User = mongoose.model('User', UserSchema)

export default User