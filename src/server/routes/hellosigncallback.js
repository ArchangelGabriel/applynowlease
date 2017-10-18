import express from 'express'

const router = express.Router()

router.post('/hellosigncallback', (req, res) => {
  console.log(req)
  res.send("Hello API Event Received")
})

export default router