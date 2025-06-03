// const express = require("express");
// const router = express.Router();
// const {Register} = require("../logics/logics");

// router.post("/register", Register);

// module.exports = router;
// router.get("/test", (req, res) => {
//   res.send("Welcome to the API");
//   req.body = {message : "Welcome to the API"};
// });

const express = require("express");
const router = express.Router();
const { Register, Getuser, GetallUsers, CategoryCreate, 
  SubcategoryCreate, ProductCreate, UpdateSubcategory,
  getCategory, getSubcategory, getProducts,
  UpdateProduct, ShippingAddressCreate, OrderCreate,
  PaymentCreate, PaymentUpdate, OrderGet

 } = require("../logics/logics");

router.post("/register", Register);

router.get("/test", (req, res) => {
  res.send("Welcome to the API");
  req.body = { message: "Welcome to the API" };
});

router.get("/allusers", GetallUsers);

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
router.post("/order", OrderCreate);
router.post("/payment", PaymentCreate);
router.put("/payment/:id", PaymentUpdate);
router.get("/get_order", OrderGet)

router.get("/show", (req, res)=>{
  
  res.body = { message: "Image sent successfully" };
  res.status(200).json({ message: "Image sent successfully" });
})

module.exports = router;
