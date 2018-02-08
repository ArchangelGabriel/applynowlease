import keystone from 'keystone'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import { SECRET } from '../config'

const Types = keystone.Field.Types

const User = new keystone.List('User', {
  track: {
    createdAt: true,
    updatedAt: true,
  }
})

User.add({
  email: { type: String, required: true, initial: true, index: true, unique: true },
  password: { type: Types.Password, required: true, initial: true },
  admin: { type: Boolean, default: false, index: true },
  firstName: { type: String },
  lastName: { type: String },
  city: { type: String },
  state: { type: String },
  zip: { type: String },
  resetPasswordToken: { type: String },
  resetPasswordExpires: Date,
})

User.schema.methods.generateJWT = function() {
  const today = new Date()
  const exp = new Date(today)
  exp.setDate(today.getDate() + 60)

  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      firstName: this.firstName,
      lastName: this.lastName,
      admin: this.admin,
      exp: parseInt(exp.getTime() / 1000, 10),
    },
    SECRET,
  )
}

User.schema.methods.toAuthJSON = function() {
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

User.schema.methods.toJSON = function() {
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

User.schema.methods.verifyPassword = function(password) {
  return bcrypt
    .compare(password, this.password)
}

User.register()

export default User.model