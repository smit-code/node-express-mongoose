const bcrypt = require('bcryptjs');
const Auth = require('../models/auth');

exports.seedAdmin = async (req, res, next) => {
	const admin = await Auth.findOne({ email: process.env.ADMIN_EMAIL });
	if (!admin) {
		const hashedPw = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);
		await Auth.create({
			first_name: 'LMS',
			last_name: 'Admin',
			email: process.env.ADMIN_EMAIL,
			password: hashedPw
		});
		console.log('Admin Seeded');
	}
};
