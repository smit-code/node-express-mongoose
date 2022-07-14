const express = require('express');
const router = express.Router();

const userController = require('../../controllers/admin/userController');
const Validator = require('../../utils/validateRequest');
const auth = require('../../middleware/jwtAuth');

const use = (fn) => (req, res, next) => {
	Promise.resolve(fn(req, res, next)).catch(next);
};

router.post(
	'/',
	auth,
	Validator('addUser'),
	use(userController.addUser)
);

router.get('/:id', auth, use(userController.getUser));

router.get('/', auth, use(userController.getAllUsers));

router.put(
	'/:id',
	auth,
	Validator('updateUser'),
	use(userController.updateUser)
);

router.delete('/:id', auth, use(userController.deleteUser));

module.exports = router;
