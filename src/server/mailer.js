import { SENDGRID_API_KEY } from './config'
import sgMail from '@sendgrid/mail'

sgMail.setApiKey(SENDGRID_API_KEY)

export const forgotOpts = ({
  user,
  resetLink,
}) => ({
  to: user.email,
  from: 'donotreploy@applynowleasing.com',
  subject: '[Action Required] Reset Password',
  text: `
    You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n
    Please click on the following link, or paste this into your browser to complete the process:\n
    ${resetLink}\n\n
    If you did not request this, please ignore this email and your password will remain unchanged.
  `
})

export const applyToPropertyOpts = ({
  sender,
  application,
  applicationLink,
}) => ({
  to: application.email,
  from: 'donotreply@applynowleasing.com',
  subject: `[Action Required] Fill Up Credit/Background Check Documents`,
  text: `
    ${(sender.firstName && sender.lastname && `${sender.firstName} ${sender.lastName}`) || sender.email} has requested you fill up this form:
    ${applicationLink}
  `
})

export default sgMail