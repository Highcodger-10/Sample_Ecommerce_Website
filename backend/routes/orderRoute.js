const express = require("express");
const { createnewOrder, getSingleOrder, getmyOrders, getallOrders, updatingOrder, deleteOrder } = require("../controllers/orderController.js");
const { isAuthenticatedUser, authorizedRoles } = require("../middleware/auth.js");

const router = express.Router();

router.route("/order/new").post(isAuthenticatedUser,createnewOrder);
router.route("/order/:id").get(isAuthenticatedUser, getSingleOrder);
router.route("/orders/me").get(isAuthenticatedUser, getmyOrders);
router.route("/admin/orders").get(isAuthenticatedUser, authorizedRoles("admin"), getallOrders);
router.route("/admin/order/:id").put(isAuthenticatedUser, authorizedRoles("admin"), updatingOrder);
router.route("/admin/order/:id").delete(isAuthenticatedUser, authorizedRoles("admin"), deleteOrder);







module.exports = router;