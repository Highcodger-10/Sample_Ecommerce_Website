const express = require("express");
const { registerUser, userlogin, userlogout, forgetPassword, resetPassword, getUserDeatils, updateUserPassword, updateUserProfile, getallusers, getauser, updateUserRole, deleteaUser } = require("../controllers/userController.js");
const router = express.Router();
const { isAuthenticatedUser, authorizedRoles } = require("../middleware/auth.js");


router.route("/register").post(registerUser);
router.route("/login").post(userlogin);
router.route("/logout").get(userlogout);
router.route("/password/forgot").post(forgetPassword);
router.route("/password/reset/:token").put(resetPassword);
router.route("/me").get(isAuthenticatedUser, getUserDeatils);
router.route("/password/update").put(isAuthenticatedUser, updateUserPassword);
router.route("/me/update").put(isAuthenticatedUser, updateUserProfile);
router.route("/admin/users").get(isAuthenticatedUser, authorizedRoles("admin"), getallusers);
router.route("/admin/user/:id")
  .get(isAuthenticatedUser, authorizedRoles("admin"), getauser)
  .put(isAuthenticatedUser, authorizedRoles("admin"), updateUserRole)
  .delete(isAuthenticatedUser, authorizedRoles("admin"), deleteaUser);

module.exports = router;