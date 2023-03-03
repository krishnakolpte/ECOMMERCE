const express = require("express");
const {
	processPayment,
	sendStripeApiKey,
} = require("../controllers/paymentControllers");
const router = express.Router();
const { isAutenticatedUser } = require("../middleware/auth");

router.route("/payment/process").post(isAutenticatedUser, processPayment);

router.route("/stripeapikey").get(isAutenticatedUser, sendStripeApiKey);

module.exports = router;
