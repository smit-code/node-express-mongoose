const express = require('express')
const router = express.Router()

router.use('/admin', require('./admin/index'))
router.use('/common', require('./common/index'))

module.exports = router
