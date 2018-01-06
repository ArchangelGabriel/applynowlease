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
  },
  admin: {
    type: Boolean,
    default: false
  },
  firstName: String,
  lastName: String,
  city: String,
  state: String,
  zip: String,
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
      admin: this.admin,
      exp: parseInt(exp.getTime() / 1000, 10),
    },
    SECRET,
  )
}

UserSchema.methods.toAuthJSON = function() {
  return {
    _id: this._id,
    email: this.email,
    firstName: this.firstName,
    lastName: this.lastName,
    city: this.city,
    state: this.state,
    zip: this.zip,
    token: this.generateJWT(),
  }
}

UserSchema.methods.toJSON = function() {
  return {
    _id: this._id,
    email: this.email,
    firstName: this.firstName,
    lastName: this.lastName,
    city: this.city,
    state: this.state,
    zip: this.zip,
  }
}

UserSchema.methods.verifyPassword = function(password) {
  return bcrypt
    .compare(password, this.password)
}

const User = mongoose.model('User', UserSchema)

export default User