import HelloSign from 'hellosign-sdk'
import { HELLO_SIGN_API_KEY } from 'server/config'

const hellosign = HelloSign({ key: HELLO_SIGN_API_KEY })

export default hellosign