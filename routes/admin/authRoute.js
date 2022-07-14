const express = require('express');
const router = express.Router();

const authController = require('../../controllers/admin/authController.js');
const Validator = require('../../utils/validateRequest');

const use = (fn) => (req, res, next) => {
	Promise.resolve(fn(req, res, next)).catch(next);
};

router.post('/', Validator('auth'), use(authController.login));

module.exports = router;
