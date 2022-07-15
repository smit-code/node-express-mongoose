const express = require('express')
const router = express.Router()

router.use('/', require('../auth/authRoute'))

module.exports = router
