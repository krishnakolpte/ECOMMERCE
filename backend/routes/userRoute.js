const express = require("express");
const {
	registerUser,
	loginUser,
	logoutUser,
	forgoutPassword,
	resetPassword,
	getUserDetails,
	updatePassword,
	updateUserProfile,
	getAllUsers,
	getSingleUser,
	updateUserRole,
	deleteUser,
} = require("../controllers/userController");
const { isAutenticatedUser, authorizeRoles } = require("../middleware/auth");

const router = express.Router();

router.route("/register").post(registerUser);

router.route("/login").post(loginUser);

router.route("/password/forgout").post(forgoutPassword);

router.route("/password/reset/:token").put(resetPassword);

router.route("/logout").get(logoutUser);

router.route("/me").get(isAutenticatedUser, getUserDetails);

router.route("/password/update").put(isAutenticatedUser, updatePassword);

router.route("/me/update").put(isAutenticatedUser, updateUserProfile);

router
	.route("/admin/users")
	.get(isAutenticatedUser, authorizeRoles("admin"), getAllUsers);

router
	.route("/admin/user/:id")
	.get(isAutenticatedUser, authorizeRoles("admin"), getSingleUser);

router
	.route("/admin/user/:id")
	.put(isAutenticatedUser, authorizeRoles("admin"), updateUserRole);

router
	.route("/admin/user/:id")
	.delete(isAutenticatedUser, authorizeRoles("admin"), deleteUser);

module.exports = router;
