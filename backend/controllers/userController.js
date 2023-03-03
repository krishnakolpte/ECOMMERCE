const User = require("../models/userModel");
const ErrorHandler = require("../utils/errorHadler");
const catchAsyncErrors = require("../middleware/cathchAsyncErrors");
const sentToken = require("../utils/jwtToken");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");
const cloudinary = require("cloudinary");

// register  user
exports.registerUser = catchAsyncErrors(async (req, res, next) => {
	const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
		folder: "avatars",
		width: 150,
		crop: "scale",
	});
	const { name, email, password } = req.body;

	const user = await User.create({
		name,
		email,
		password,
		avatar: {
			public_id: myCloud.public_id,
			url: myCloud.secure_url,
		},
	});
	await user.save();

	sentToken(user, 201, res);
});

//login user
exports.loginUser = catchAsyncErrors(async (req, res, next) => {
	const { email, password } = req.body;

	//checking if user has given email and password
	if (!email || !password) {
		return next(new ErrorHandler("Plese enter Email & Password", 400));
	}

	const user = await User.findOne({ email }).select("+password");

	if (!user) {
		return next(new ErrorHandler("invalid Email or Password", 401));
	}

	const isPasswordMatched = await user.comparePassword(password);

	if (!isPasswordMatched) {
		return next(new ErrorHandler("invalid Email or Password", 401));
	}

	sentToken(user, 200, res);
});

//logout user
exports.logoutUser = catchAsyncErrors(async (req, res, next) => {
	res.cookie("token", null, {
		expires: new Date(Date.now()),
		httpOnly: true,
	});

	res.status(200).json({
		success: true,
		message: "Logged Out",
	});
});

//forgout password
exports.forgoutPassword = catchAsyncErrors(async (req, res, next) => {
	const user = await User.findOne({ email: req.body.email });

	if (!user) {
		return next(new ErrorHandler("User Not Found", 404));
	}

	//get resetPasswordToken
	const restToken = user.getRestPasswordToken();

	await user.save({ validateBeforeSave: false });

	const resetPasswordUrl = `${req.protocol}://${req.get(
		"host"
	)}/password/reset/${restToken}`;

	const message = `Your password reset token is :- \n\n ${resetPasswordUrl} \n\n If you have not requested email then, please ignore it.`;

	try {
		await sendEmail({
			email: user.email,
			subject: `Ecommerce Password Recovery`,
			message,
		});

		res.status(200).json({
			success: true,
			message: `Email sent to ${user.email} successfully`,
		});
	} catch (error) {
		user.resetPasswordToken = undefined;
		user.resetPasswordExpier = undefined;
		await user.save({ validateBefoureSave: false });

		return next(new ErrorHandler(error.message, 500));
	}
});

//rest password
exports.resetPassword = catchAsyncErrors(async (req, res, next) => {
	//creating token hash
	const resetPasswordToken = crypto
		.createHash("sha256")
		.update(req.params.token)
		.digest("hex");

	const user = await User.findOne({
		resetPasswordToken,
		resetPasswordExpier: { $gt: Date.now() },
	});

	if (!user) {
		return next(
			new ErrorHandler(
				"Reset password token is invalid or has been expired",
				400
			)
		);
	}

	if (req.body.password !== req.body.confirmPassword) {
		return next(new ErrorHandler("password does not match", 400));
	}

	user.password = req.body.password;
	user.resetPasswordToken = undefined;
	user.resetPasswordExpier = undefined;

	await user.save();

	sentToken(user, 200, res);
});

//get single user details for user
exports.getUserDetails = catchAsyncErrors(async (req, res, next) => {
	const user = await User.findById(req.user.id);

	res.status(200).json({
		success: true,
		user,
	});
});

//update user password
exports.updatePassword = catchAsyncErrors(async (req, res, next) => {
	const user = await User.findById(req.user.id).select("+password");

	const isPasswordMatche = await user.comparePassword(req.body.oldPassword);

	if (!isPasswordMatche) {
		return next(new ErrorHandler("Old Password Incorrect", 400));
	}

	if (req.body.newPassword !== req.body.confirmPassword) {
		return next(new ErrorHandler("password does not match", 400));
	}

	user.password = req.body.newPassword;

	await user.save();

	sentToken(user, 200, res);
});

//update user profile
exports.updateUserProfile = catchAsyncErrors(async (req, res, next) => {
	const newUserData = {
		name: req.body.name,
		email: req.body.email,
	};

	if (req.body.avatar !== "") {
		const user = await User.findById(req.user.id);
		const imageId = user.avatar.public_id;
		await cloudinary.v2.uploader.destroy(imageId);
		const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
			folder: "avatars",
			width: 150,
			crop: "scale",
		});
		newUserData.avatar = {
			public_id: myCloud.public_id,
			url: myCloud.secure_url,
		};
	}

	await User.findByIdAndUpdate(req.user.id, newUserData, {
		new: true,
		runValidators: true,
		useFindModify: false,
	});

	res.status(200).json({
		success: true,
	});
});

//Get all users details ----(admin)
exports.getAllUsers = catchAsyncErrors(async (req, res, next) => {
	const users = await User.find();

	res.status(200).json({
		success: true,
		users,
	});
});

//Get single users details for ----(admin)
exports.getSingleUser = catchAsyncErrors(async (req, res, next) => {
	const user = await User.findById(req.params.id);

	if (!user) {
		return next(
			new ErrorHandler(
				`user does not exist with id: ${req.params.id}`,
				400
			)
		);
	}

	res.status(200).json({
		success: true,
		user,
	});
});

//update user role (admin)
exports.updateUserRole = catchAsyncErrors(async (req, res, next) => {
	const user = await User.findById(req.params.id);

	if (!user) {
		return next(
			new ErrorHandler(
				`user does not exist with id: ${req.params.id}`,
				400
			)
		);
	}

	const newUserData = {
		name: req.body.name,
		email: req.body.email,
		role: req.body.role,
	};

	await User.findByIdAndUpdate(req.params.id, newUserData, {
		new: true,
		runValidators: true,
		useFindModify: false,
	});

	res.status(200).json({
		success: true,
	});
});

//delete user -- (admin)
exports.deleteUser = catchAsyncErrors(async (req, res, next) => {
	const user = await User.findById(req.params.id);

	if (!user) {
		return next(
			new ErrorHandler(
				`user does not exist with id: ${req.params.id}`,
				400
			)
		);
	}

	const imageId = user.avatar.public_id;
	await cloudinary.v2.uploader.destroy(imageId);

	await user.remove();

	res.status(200).json({
		success: true,
		message: "user deleted successfully",
	});
});
