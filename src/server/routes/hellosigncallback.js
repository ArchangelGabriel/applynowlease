import express from 'express'
import multer from 'multer'

const router = express.Router()
const upload = multer()

router.post('/hellosigncallback', upload.any(), (req, res) => {
  console.log(req.files)
  res.send("Hello API Event Received")
})

export default router