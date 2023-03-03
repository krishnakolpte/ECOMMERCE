const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const userSchema = new mongoose.Schema({
	name: {
		type: String,
		required: [true, "please enter your name"],
		maxlength: [30, "cannot exceed 30 charecters"],
		minlength: [4, "name have more than 4 charecters"],
		trim: true,
	},
	email: {
		type: String,
		required: [true, "please enter yuor email"],
		unique: true,
		validate: [validator.isEmail, "please enter a valid email"],
	},
	password: {
		type: String,
		required: [true, "please enter yuor password"],
		minlength: [8, "password have more than 8 charecters"],
		select: false,
	},
	avatar: {
		public_id: {
			type: String,
			required: true,
		},
		url: {
			type: String,
			required: true,
		},
	},
	role: {
		type: String,
		default: "user",
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
	resetPasswordToken: String,
	resetPasswordExpier: Date,
});

userSchema.pre("save", async function (next) {
	if (!this.isModified("password")) {
		next();
	}

	this.password = await bcrypt.hash(this.password, 10);
});

//Jwt token
userSchema.methods.getJWToken = function () {
	return jwt.sign({ id: this._id }, process.env.JWT_SECRETE, {
		expiresIn: process.env.JWT_EXPIERE,
	});
};

//compare password
userSchema.methods.comparePassword = async function (enteredPassword) {
	return await bcrypt.compare(enteredPassword, this.password);
};

//generating password reset token
userSchema.methods.getRestPasswordToken = function () {
	//generating token
	const resetToken = crypto.randomBytes(20).toString("hex");

	//hashing and adding to user scema
	this.resetPasswordToken = crypto
		.createHash("sha256")
		.update(resetToken)
		.digest("hex");

	this.resetPasswordExpier = Date.now() + 15 * 60 * 1000;

	return resetToken;
};

module.exports = mongoose.model("User", userSchema);
