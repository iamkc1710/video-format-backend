const express = require("express");
const {generateToken} = require("../services/authentication.js");
const router = express.Router();

router.post('/', (req, res) => {
  const token = generateToken({username: req.headers.username, password: req.headers.password});
  console.log('Hi', token);
});


router.use("/merge", require("./merge.js"));
router.use("/upload", require("./upload.js"));
router.use("/trim", require("./trim.js"));

module.exports = router;