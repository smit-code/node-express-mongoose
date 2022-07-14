const User = require('../../models/admin/user');
const bcrypt = require('bcryptjs');
const responseHelper = require('../../utils/responseHandler');

exports.addUser = async (req, res, next) => {
	const hashedPw = await bcrypt.hash(req.body.password, 12);
	const newUser = new User({
		first_name: req.body.first_name,
		last_name: req.body.last_name,
		email: req.body.email,
		email_verified_at: req.body.email_verified_at,
		password: hashedPw,
		phone: req.body.phone,
		image: req.body.image,
		is_active: req.body.is_active,
		remember_token: req.body.remember_token
	});

	const user = await newUser.save();

	const result = {
		id: user._id.toString(),
		first_name: user.first_name,
		last_name: user.last_name,
		email: user.email,
		email_verified_at: user.email_verified_at,
		phone: user.phone,
		image: user.image,
		is_active: user.is_active,
		remember_token: user.remember_token
	};

	return res
		.status(200)
		.json(
			responseHelper.prepareSuccessResponse(result, 'User saved successfully.')
		);
};

exports.getUser = async (req, res, next) => {
	const id = req.params.id;
	const user = await User.findById(id).select('-password');
	if (!user) {
		const error = new Error('User not found.');
		error.statusCode = 404;
		throw error;
	}

	const result = {
		id: user._id.toString(),
		first_name: user.first_name,
		last_name: user.last_name,
		email: user.email,
		email_verified_at: user.email_verified_at,
		phone: user.phone,
		image: user.image,
		is_active: user.is_active,
		remember_token: user.remember_token
	};

	return res
		.status(200)
		.json(
			responseHelper.prepareSuccessResponse(
				result,
				'User retrieved successfully.'
			)
		);
};

exports.getAllUsers = async (req, res, next) => {
	const users = await User.find().select('-password');

	const result = users.map((user) => {
		return {
			id: user._id.toString(),
			first_name: user.first_name,
			last_name: user.last_name,
			email: user.email,
			email_verified_at: user.email_verified_at,
			phone: user.phone,
			image: user.image,
			is_active: user.is_active,
			remember_token: user.remember_token
		};
	});

	return res
		.status(200)
		.json(
			responseHelper.prepareSuccessResponse(
				result,
				'Users retrieved successfully.'
			)
		);
};

exports.updateUser = async (req, res, next) => {
	const id = req.params.id;
	let user = await User.findById(id);
	if (!user) {
		const error = new Error('Could not find user.');
		error.statusCode = 404;
		throw error;
	}

	user.first_name = req.body.first_name;
	user.last_name = req.body.last_name;
	user.email = req.body.email;
	user.email_verified_at = req.body.email_verified_at;
	user.phone = req.body.phone;
	user.image = req.body.image;
	user.is_active = req.body.is_active;
	user.remember_token = req.body.remember_token;

	user = await user.save();

	const result = {
		id: user._id.toString(),
		first_name: user.first_name,
		last_name: user.last_name,
		email: user.email,
		email_verified_at: user.email_verified_at,
		phone: user.phone,
		image: user.image,
		is_active: user.is_active,
		remember_token: user.remember_token
	};

	return res
		.status(200)
		.json(
			responseHelper.prepareSuccessResponse(
				result,
				'User updated successfully.'
			)
		);
};

exports.deleteUser = async (req, res, next) => {
	const id = req.params.id;
	const user = await User.findByIdAndRemove(id);
	if (!user) {
		const error = new Error('Could not find user.');
		error.statusCode = 404;
		throw error;
	}
	return res
		.status(200)
		.json(
			responseHelper.prepareSuccessResponse({}, 'User deleted successfully.')
		);
};
