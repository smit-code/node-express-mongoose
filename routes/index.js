const express = require('express');
const router = express.Router();

router.use('/admin', require('./admin/index'));
router.use('/', require('./admin/index'));

module.exports = router;
