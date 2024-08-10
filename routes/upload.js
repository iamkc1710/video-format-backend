const express = require("express");
const router = express.Router();
const multer  = require('multer');
const {authenticateToken} = require("../services/authentication.js");
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './uploads')
    },
    filename: function (req, file, cb) {
        console.log(file);
      const uniqueSuffix = Date.now();
      cb(null, uniqueSuffix + '-' + file?.originalname)
    }
  })
  
const upload = multer({ storage: storage }).single('file');

router.post('/', authenticateToken, function (req, res) {
    upload(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            // A Multer error occurred when uploading.
            res.send('A Multer error occurred when uploading');
          } else if (err) {
            res.send('An error occurred when uploading');
            // An unknown error occurred when uploading.
          }
        res.send(req?.file?.originalname + ' uploaded successfully');
    });
});

module.exports = router;