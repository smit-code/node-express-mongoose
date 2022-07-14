const express = require('express');
const router = express.Router();

router.use('/books', require('./bookRoute'));

module.exports = router;
