import crypto from 'crypto'
import express from 'express'
import multer from 'multer'

import { HELLO_SIGN_API_KEY } from 'server/config'

const router = express.Router()
const upload = multer()

router.post('/hellosigncallback', upload.any(), (req, res) => {
  const event = JSON.parse(req.body.json).event

  const {
    event_time,
    event_type,
    event_hash
  } = event

  const hash = crypto
    .createHmac('sha256', HELLO_SIGN_API_KEY)
    .update(event_time + event_type)
    .digest('hex')
    .toString()

  if (event_hash === hash) {
    console.log(event)
    res.send("Hello API Event Received")
  } else {
    res.sendStatus(401)
  }
})

export default router