const Order = require("../models/orderModle");
const Product = require("../models/productModel");
const ErrorHandler = require("../utils/errorHadler");
const catchAsyncErrors = require("../middleware/cathchAsyncErrors");

//create order
exports.newOrder = catchAsyncErrors(async (req, res, next) => {
	const {
		shippingInfo,
		orderItems,
		paymentInfo,
		itemsPrice,
		taxPrice,
		shippingPrice,
		totalPrice,
	} = req.body;

	const order = await Order.create({
		shippingInfo,
		orderItems,
		paymentInfo,
		itemsPrice,
		taxPrice,
		shippingPrice,
		totalPrice,
		paidAt: Date.now(),
		user: req.user._id,
	});

	res.status(201).json({
		success: true,
		order,
	});
});

//get logged in user order details
exports.getSingleOrder = catchAsyncErrors(async (req, res, next) => {
	const order = await Order.findById(req.params.id).populate(
		"user",
		"name email"
	);

	if (!order) {
		return next(
			new ErrorHandler(
				`Order not found with this id: ${req.params.id}`,
				404
			)
		);
	}

	res.status(200).json({
		success: true,
		order,
	});
});

//get get my orders
exports.getMyOrders = catchAsyncErrors(async (req, res, next) => {
	const orders = await Order.find({ user: req.user._id });

	res.status(200).json({
		success: true,
		orders,
	});
});

//get All orders ---(admin)
exports.getAllOrders = catchAsyncErrors(async (req, res, next) => {
	const orders = await Order.find();

	let totalAmount = 0;

	orders.forEach((order) => {
		totalAmount += order.totalPrice;
	});

	res.status(200).json({
		success: true,
		totalAmount,
		orders,
	});
});

//update orders status ---(admin)
exports.updateOrderStatus = catchAsyncErrors(async (req, res, next) => {
	const order = await Order.findById(req.params.id);

	if (!order) {
		return next(
			new ErrorHandler(
				`Order not found with this id: ${req.params.id}`,
				404
			)
		);
	}

	if (order.orderStatus === "delivered") {
		return next(
			new ErrorHandler("You Have Already Delivered this order", 404)
		);
	}

	if (req.body.status === "shipped") {
		order.orderItems.forEach(async (o) => {
			await updateStock(o.product, o.quantity);
		});
	}

	order.orderStatus = req.body.status;

	if (req.body.status === "delivered") {
		order.deliveredAt = Date.now();
	}

	await order.save({ validateBeforeSave: false });

	res.status(200).json({
		success: true,
	});
});

async function updateStock(id, quantity) {
	const product = await Product.findById(id);

	product.stock = product.stock - quantity;

	await product.save({ validateBeforeSave: false });
}

//delete order ---(admin)
exports.deleteOrder = catchAsyncErrors(async (req, res, next) => {
	const order = await Order.findById(req.params.id);

	if (!order) {
		return next(
			new ErrorHandler(
				`Order not found with this id: ${req.params.id}`,
				404
			)
		);
	}

	await order.remove();

	res.status(200).json({
		success: true,
	});
});
