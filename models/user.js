const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema(
	{
		first_name: { type: String },
		last_name: { type: String },
		email: { type: String },
		email_verified_at: { type: Date },
		password: { type: String },
		confirm_password: { type: String },
		phone: { type: Number },
		image: { type: String },
		is_active: { type: Boolean },
		remember_token: { type: Boolean }
	},
	{ timestamps: true }
);

userSchema.pre('save', async function (next, done) {
	try {
		const emailExists = await mongoose.models.User.findOne({
			email: this.email
		});
		if (emailExists) {
			if (emailExists._id.toString() !== this._id.toString()) {
				const error = new Error('User already registered with this email');
				error.statusCode = 422;
				throw error;
			}
		}
		next();
	} catch (error) {
		return next(error);
	}
});

module.exports = mongoose.model('User', userSchema);
