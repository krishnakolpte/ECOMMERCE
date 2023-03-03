const express = require("express");
const {
	getAllProducts,
	createProduct,
	updateProduct,
	deleteProduct,
	getProductDetails,
	review,
	getProductReviews,
	deleteReview,
	getAdminProducts,
} = require("../controllers/productController");
const { isAutenticatedUser, authorizeRoles } = require("../middleware/auth");

const router = express.Router();

router.route("/products").get(getAllProducts);

router
	.route("/admin/products")
	.get(isAutenticatedUser, authorizeRoles("admin"), getAdminProducts);

router
	.route("/admin/products/new")
	.post(isAutenticatedUser, authorizeRoles("admin"), createProduct);

router
	.route("/admin/products/:id")
	.put(isAutenticatedUser, authorizeRoles("admin"), updateProduct)
	.delete(isAutenticatedUser, authorizeRoles("admin"), deleteProduct);

router.route("/product/:id").get(getProductDetails);

router.route("/review").put(isAutenticatedUser, review);

router
	.route("/reviews")
	.get(getProductReviews)
	.delete(isAutenticatedUser, deleteReview);

module.exports = router;
