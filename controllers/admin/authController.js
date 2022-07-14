const Auth = require('../../models/auth');
const responseHelper = require('../../utils/responseHandler');
const bcrypt = require('bcryptjs');

const jwt = require('jsonwebtoken');

exports.login = async (req, res, next) => {
	const email = req.body.email;
	const password = req.body.password;

	const admin = await Auth.findOne({ email });
	if (!admin) {
		const error = new Error('Invalid username or password.');
		error.statusCode = 422;
		throw error;
	}

	const isEqual = await bcrypt.compare(password, admin.password);

	if (!isEqual) {
		const error = new Error('Invalid username or password.');
		error.statusCode = 422;
		throw error;
	}

	const token = jwt.sign(
		{
			id: admin._id,
			email: admin.email
		},
		process.env.SECRET_KEY,
		{ expiresIn: '12h' }
	);

	const result = {
		token,
		user: {
			id: admin._id,
			first_name: admin.first_name,
			last_name: admin.last_name,
			email: admin.email
		}
	};

	return res
		.status(200)
		.json(
			responseHelper.prepareSuccessResponse(result, 'Logged in successfully.')
		);
};
