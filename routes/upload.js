const express = require('express');
const multer = require('multer');
const AWS = require('aws-sdk');
const config = require('../config');

const router = express.Router();

const s3 = new AWS.S3({
    accessKeyId: config.accessKeyId,
    secretAccessKey: config.secretAccessKey
})

const storage = multer.memoryStorage({
    destination: function(req, file, callback) {
        callback(null, '')
    }
})

const upload = multer({storage}).single('image')

router.post('/upload', upload, (req, res) => {
    const newName = (new Date()).valueOf();
    const fileName = `${newName}_parasite.jpg`;

    const params = {
        Bucket: config.bucketName,
        Key: fileName,
        Body: req.file.buffer,
        ACL: 'public-read',
        ContentType: 'image/jpeg',
    }

    s3.upload(params, (error, data) => {
        if(error){
          res.status(500).send(error)
        }
        res.status(200).send({
          message: 'Upload Success',
          data: data
        })
    })
})

module.exports = router
