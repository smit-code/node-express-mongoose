const mongoose = require('mongoose')
const Schema = mongoose.Schema

const authSchema = new Schema(
  {
    first_name: { type: String },
    last_name: { type: String },
    email: { type: String },
    // email_verified_at: { type: Date },
    password: { type: String },
    phone: { type: Number },
    image: { type: String },
    image_path: { type: String },
    email_verified_at: { type: String },
    is_active: { type: Boolean },
    remember_token: { type: Boolean }
  },
  { timestamps: true }
)

module.exports = mongoose.model('Auth', authSchema)
