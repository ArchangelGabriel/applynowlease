import path from 'path'
import S3 from 'aws-sdk/clients/s3'
import multer from 'multer'
import multerS3 from 'multer-s3'

import { NODE_ENV } from 'server/config'

const config = {
  'development': 'dev',
  'production': 'prod',
  'testing': 'test'
}

export const s3 = new S3()

export const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: 'applynowleases3',
    acl: 'authenticated-read',
    contentDisposition: 'attachment',
    serverSideEncryption: 'AES256',
    key: function (req, file, cb) {
      const fileName = path.join(
        'applications',
        req.params._id,
        `${file.originalname}`,
      )
      cb(null, fileName)
    }
  })
})
