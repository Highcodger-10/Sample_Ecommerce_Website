const express = require("express");
const { getAllProducts, createProduct, updateProduct, deleteProduct, getProductDetails, createProductReview, getProductReviews, deletereview } = require("../controllers/productsController");
const { isAuthenticatedUser, authorizedRoles } = require("../middleware/auth.js");

const router = express.Router();

router.route("/products").get( getAllProducts);


router.route("/admin/product/new").post(isAuthenticatedUser,authorizedRoles("admin"),createProduct);

router.route("/admin/product/:id")
.put(isAuthenticatedUser,authorizedRoles("admin"),updateProduct)
.delete(isAuthenticatedUser,authorizedRoles("admin"),deleteProduct)

router.route("/product/:id").get(getProductDetails);

router.route("/review").put(isAuthenticatedUser,createProductReview);

router.route("/getproductreviews").get(getProductReviews).delete(isAuthenticatedUser, deletereview);

module.exports = router;