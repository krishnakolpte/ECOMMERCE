const Product = require("../models/productModel");
const ErrorHandler = require("../utils/errorHadler");
const catchAsyncErrors = require("../middleware/cathchAsyncErrors");
const ApiFeatures = require("../utils/apiFeatures");
const cloudinary = require("cloudinary");

//Create product
exports.createProduct = catchAsyncErrors(async (req, res, next) => {
	let images = [];

	if (typeof req.body.images === "string") {
		images.push(req.body.images);
	} else {
		images = req.body.images;
	}

	const imagesLink = [];
	for (let i = 0; i < images.length; i++) {
		const result = await cloudinary.v2.uploader.upload(images[i], {
			folder: "products",
		});

		imagesLink.push({
			public_id: result.public_id,
			url: result.secure_url,
		});
	}
	req.body.images = imagesLink;

	req.body.user = req.user.id;

	const product = await Product.create(req.body);

	res.status(201).json({
		success: true,
		product,
	});
});

//get all products ----Admin
exports.getAllProducts = catchAsyncErrors(async (req, res, next) => {
	const resultPerPage = 8;
	const productsCount = await Product.countDocuments();

	const apiFeature = new ApiFeatures(Product.find(), req.query)
		.search()
		.filter()
		.pagination(resultPerPage);

	let products = await apiFeature.query;
	let filteredProductsCount = products.length;

	res.status(200).json({
		success: true,
		products,
		productsCount,
		resultPerPage,
		filteredProductsCount,
	});
});

//get all admin products ----Admin
exports.getAdminProducts = catchAsyncErrors(async (req, res, next) => {
	const products = await Product.find();

	res.status(200).json({
		success: true,
		products,
	});
});

// get product details
exports.getProductDetails = catchAsyncErrors(async (req, res, next) => {
	const product = await Product.findById(req.params.id);

	if (!product) {
		return next(new ErrorHandler("product not found.", 404));
	}

	res.status(200).json({
		success: true,
		product,
	});
});

//update product ---admin
exports.updateProduct = catchAsyncErrors(async (req, res, next) => {
	let product = await Product.findById(req.params.id);
  
	if (!product) {
	  return next(new ErrorHandler("Product not found", 404));
	}
  
	// Images Start Here
	let images = [];
  
	if (typeof req.body.images === "string") {
	  images.push(req.body.images);
	} else {
	  images = req.body.images;
	}
  
	if (images !== undefined) {
	  // Deleting Images From Cloudinary
	  for (let i = 0; i < product.images.length; i++) {
		await cloudinary.v2.uploader.destroy(product.images[i].public_id);
	  }
  
	  const imagesLinks = [];
  
	  for (let i = 0; i < images.length; i++) {
		const result = await cloudinary.v2.uploader.upload(images[i], {
		  folder: "products",
		});
  
		imagesLinks.push({
		  public_id: result.public_id,
		  url: result.secure_url,
		});
	  }
  
	  req.body.images = imagesLinks;
	}
  
	product = await Product.findByIdAndUpdate(req.params.id, req.body, {
	  new: true,
	  runValidators: true,
	  useFindAndModify: false,
	});
  
	res.status(200).json({
	  success: true,
	  product,
	});
  });
  
//delete product ----admin
exports.deleteProduct = catchAsyncErrors(async (req, res, next) => {
	const product = await Product.findById(req.params.id);

	if (!product) {
		return next(new ErrorHandler("product not found.", 404));
	}

	//deleting images from cloudinory
	for (let i = 0; i < product.images.length; i++) {
		const result = await cloudinary.v2.uploader.destroy(
			product.images[i].public_id
		);
	}

	await product.remove();

	res.status(200).json({
		success: true,
		message: "product deleted succesfully",
	});
});

//create review or update review
exports.review = catchAsyncErrors(async (req, res, next) => {
	const { rating, comment, productId } = req.body;

	const review = {
		user: req.user.id,
		name: req.user.name,
		rating: Number(rating),
		comment,
	};

	const product = await Product.findById(productId);

	const isReviewed = product.reviews.find(
		(rev) => rev.user.toString() === req.user.id.toString()
	);

	if (isReviewed) {
		product.reviews.forEach((rev) => {
			product.reviews.find(
				(rev) => rev.user.toString() === req.user.id.toString()
			);

			(rev.rating = rating), (rev.comment = comment);
		});
	} else {
		product.reviews.push(review);
		product.numOfReviews = product.reviews.length;
	}

	// 4,3,3 =10/3 = 3.5
	let avg = 0;
	product.reviews.forEach((rev) => {
		avg += rev.rating;
	});

	product.ratings = avg / product.reviews.length;

	await product.save({ validateBeforeSave: false });

	res.status(200).json({
		success: true,
	});
});

//get all reviews of a product
exports.getProductReviews = catchAsyncErrors(async (req, res, next) => {
	const product = await Product.findById(req.query.id);

	if (!product) {
		return next(new ErrorHandler("product not found.", 404));
	}

	res.status(200).json({
		success: true,
		reviews: product.reviews,
	});
});

//delete review admin
exports.deleteReview = catchAsyncErrors(async (req, res, next) => {
	const product = await Product.findById(req.query.productId);

	if (!product) {
		return next(new ErrorHandler("Product not found", 404));
	}

	const reviews = product.reviews.filter(
		(rev) => rev._id.toString() !== req.query.id.toString()
	);

	let avg = 0;

	reviews.forEach((rev) => {
		avg += rev.rating;
	});

	let ratings = 0;

	if (reviews.length === 0) {
		ratings = 0;
	} else {
		ratings = avg / reviews.length;
	}

	const numOfReviews = reviews.length;

	await Product.findByIdAndUpdate(
		req.query.productId,
		{
			reviews,
			ratings,
			numOfReviews,
		},
		{
			new: true,
			runValidators: true,
			useFindAndModify: false,
		}
	);

	res.status(200).json({
		success: true,
	});
});
