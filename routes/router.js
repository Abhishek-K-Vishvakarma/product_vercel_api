const express = require("express");
const router = express.Router();
const { Register, Getuser, GetallUsers, CategoryCreate, 
  SubcategoryCreate, ProductCreate, UpdateSubcategory,
  getCategory, getSubcategory, getProducts,
  UpdateProduct, ShippingAddressCreate,
  UserLogin, EmailVerify, DeleteAllRegisterUsers,
  UpdateUsers, Ordercreate, ShippingAddressGet,
  paymentCreate, OrderGet, PaymentGet, ProductDelete,
  forgotPassword, resetPassword
 } = require("../logics/logics");
router.post("/register", Register);
router.post("/login", UserLogin)

router.get("/test", (req, res) => {
  res.send("Welcome to the API");
  req.body = { message: "Welcome to the API" };
});
router.get("/allusers", GetallUsers);
router.post("/verify", EmailVerify)
router.get("/get/:id", Getuser);
router.post("/category", CategoryCreate);
router.post("/subcategory/:id", SubcategoryCreate);
router.post("/product/:id", ProductCreate);
router.put("/sub/:id", UpdateSubcategory);
router.get("/get_category", getCategory);
router.get("/get_subcategory", getSubcategory);
router.get("/get_product", getProducts);
router.put("/put_product/:id", UpdateProduct);
router.post("/shipping", ShippingAddressCreate);
router.delete("/user_del/:id", DeleteAllRegisterUsers);
router.put("/put_user/:id", UpdateUsers);
router.post("/order", Ordercreate);
router.get("/orderget", OrderGet);
router.get("/shipget", ShippingAddressGet);
router.post("/payment", paymentCreate);
router.get("/payment_get", PaymentGet);
router.delete("/product_del/:id", ProductDelete);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

router.get("/test",(req, res)=>{
  res.json({ message: "Upload route is working" });
});

module.exports = router;
