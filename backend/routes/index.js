const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();

router.use(bodyParser.json());
router.use('/report', require('./report'));
router.use('/search', require('./search'))

module.exports = router;