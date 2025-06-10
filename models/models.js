const mongoose = require('mongoose');

const Schema = new mongoose.Schema({
  name : {type : String, required: true},
  email : {type : String, required: true, unique: true},
  password : {type : String, required: true},
  phone: {type: String, required: true},
  address: {type: String, required: true},
  isVerified: {type: Boolean, enum: [true, false], default: false},
  gender: {type: String, required: true},
  resetToken: String,
  resetTokenExpire: String
}, {timestamps: true});

module.exports = mongoose.model('User', Schema);