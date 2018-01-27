import ta from 'time-ago'
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

export const applyToPropertyOpts2 = ({
  sender,
  application,
  applicationLink,
}) => ({
  to: application.email,
  from: 'donotreply@applynowleasing.com',
  subject: `[Action Required] Fill Up Credit/Background Check Documents`,
  text: `
    ${(sender.firstName && sender.lastName && `${sender.firstName} ${sender.lastName}`) || sender.email} has requested you fill up this form:
    ${applicationLink}
  `
})

export const applyToPropertyOpts = ({
  remind,
  sender,
  property,
  application,
  applicationLink,
  declineLink,
}) => ({
  substitutionWrappers: ['<%', '%>'],
  from: {
    email: 'applications@applynowleasing.com',
    name: 'ApplyNowLeasing'
  },
  to: application.email,
  subject: `Lease Application Form ${remind ? 'Reminder' : 'Request'}`,
  templateId: '8213f595-e82a-428a-a220-3498142e528d',
  substitutions: {
    recipient: application.applicantName,
    sender: (sender.firstName && sender.lastName && `${sender.firstName} ${sender.lastName}`) || sender.email,
    address: property.addressOne,
    price: property.monthlyAsking,
    application_url: applicationLink,
    decline_url: `${declineLink}?declineUrl=${application.declineUrl}`,
    remind: remind ? 'Just a reminder, ' : '',
    remind_ago: remind ? ` created ${ta.ago(application.createdAt)}` : '',
  }
})

export default sgMail