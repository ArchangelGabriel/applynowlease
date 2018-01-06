import { SENDGRID_API_KEY } from './config'
import sgMail from '@sendgrid/mail'

sgMail.setApiKey(SENDGRID_API_KEY)

export default sgMail