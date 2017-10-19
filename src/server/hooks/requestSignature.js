import hellosign from 'server/hellosign'
import { NODE_ENV } from 'server/config'

const testMode = NODE_ENV === 'production' ? 0 : 1

function signatureRequest({ 
  template_id,
  subject = 'Residential Lease Application',
  message = 'Please fill.',
  signers
}) {

  const opts = {
    test_mode: testMode,
    template_id,
    subject,
    message,
    signers
  }

  return hellosign.signatureRequest.sendWithTemplate(opts)
}

export default signatureRequest