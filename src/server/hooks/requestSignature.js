import hellosign from 'server/hellosign'
import { NODE_ENV, HELLO_SIGN_TEST_MODE } from 'server/config'

function signatureRequest({ 
  template_id,
  subject = 'Residential Lease Application',
  message = 'Please fill.',
  signers
}) {

  const opts = {
    test_mode: JSON.parse(HELLO_SIGN_TEST_MODE),
    template_id,
    subject,
    message,
    signers
  }

  return hellosign.signatureRequest.sendWithTemplate(opts)
}

export default signatureRequest