const express = require("express");
const { registerUser, userlogin, userlogout, forgetPassword, resetPassword } = require("../controllers/userController.js");
const router = express.Router();

router.route("/register").post(registerUser);
router.route("/login").post(userlogin);
router.route("/logout").get(userlogout);
router.route("/password/forgot").post(forgetPassword);
router.route("/password/reset/:token").put(resetPassword);

module.exports = router;