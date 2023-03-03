const express = require("express");
const {
	newOrder,
	getSingleOrder,
	getMyOrders,
	getAllOrders,
	updateOrderStatus,
	deleteOrder,
} = require("../controllers/orderController");
const { isAutenticatedUser, authorizeRoles } = require("../middleware/auth");

const router = express.Router();

router.route("/order/new").post(isAutenticatedUser, newOrder);

router.route("/order/:id").get(isAutenticatedUser, getSingleOrder);

router.route("/orders/me").get(isAutenticatedUser, getMyOrders);

router
	.route("/admin/orders")
	.get(isAutenticatedUser, authorizeRoles("admin"), getAllOrders);

router
	.route("/admin/order/:id")
	.put(isAutenticatedUser, authorizeRoles("admin"), updateOrderStatus)
	.delete(isAutenticatedUser, authorizeRoles("admin"), deleteOrder);

module.exports = router;
