import crypto from 'crypto'
import express from 'express'
import multer from 'multer'

import { HELLO_SIGN_API_KEY } from 'server/config'

import Application from 'server/models/application'

const router = express.Router()
const upload = multer()

router.post('/hellosigncallback', upload.any(), (req, res) => {
  const event = JSON.parse(req.body.json)

  const {
    event_time,
    event_type,
    event_hash
  } = event.event

  const hash = crypto
    .createHmac('sha256', HELLO_SIGN_API_KEY)
    .update(event_time + event_type)
    .digest('hex')
    .toString()

  if (event_hash === hash) {
    console.log(event)
    if (event_type === "signature_request_all_signed") {
      Application.findOneAndUpdate({
        signatureRequestId: event.signature_request.signature_request_id
      }, {
        $set: { signatureRequestAllSigned: true }
      })
    }
    res.send("Hello API Event Received")
  } else {
    res.sendStatus(401)
  }
})

export default router