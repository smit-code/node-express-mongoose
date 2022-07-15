const express = require('express')
const router = express.Router()

const auth = require('./auth/index')
const admin = require('./admin/index')
const common = require('./common/index')

router.use('/auth', auth)
router.use('/admin', admin)
router.use('/common', common)

module.exports = router
