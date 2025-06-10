// const User = require("../models/models");

// const Register = async(req, res)=>{
//    try{
//     const {name, email, password} = req.body;
//     const user = await User.findOne({email})
//     if(user) return res.status(404).json({message: "User already exist!"});
//     const newUser = new User({name, email, password});
//     const saveuser = await newUser.save();
//     res.status(201).json({message : "User registered successfully!", user : saveuser});
//    }catch(error){
//     res.status(500).json({
//       message: "Internal Server Error",
//       error: error.message
//     });
//    }
// }

// module.exports = { Register };


const User = require("../models/models");
const Category = require("../models/category");
const Subcategory = require("../models/subcategory");
const Product = require("../models/products");
const ShippingAddress = require("../models/shippingAddress");
const Order = require("../models/orders");
const Payment = require("../models/payments");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const sendMail = require("../utils");
const genotp = ()=> Math.floor(100000 + Math.random() * 900000); // Generate a random 6-digit OTP
const nodemailer = require("nodemailer");
const mongoose = require("mongoose");
const users = {};

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user : "vishabhishek019@gmail.com",
    // pass: "djcj ozsn ybbt gwpu",
    pass: "oyxt kbqa qdip dyxt"
  }
})

const Register = async (req, res) => {
  try {
    const { name, email, password, phone, address, isVerified, gender} = req.body;
    const user = await User.findOne({ email });
    if (user) return res.status(404).json({ message: "User already exists!" });
    const otp = genotp();
    const expireOtp = Date.now() + 300000;
    users[email] = {otp, expireOtp};
    const mailOptions = {
      from: "vishabhishek019@gmail.com",
      to: email,
      subject: "Welcome to Our Service : Send email for otp verify",
      text: `Your otp is ${ otp }. Please verify your email to complete the registration process.`,
    }
    await transporter.sendMail(mailOptions);
    console.log(`Your email is ${ email } and otp is : ${ otp }`);
    const salt = await bcrypt.genSalt(10);
    const hanshePassword = await bcrypt.hash(password, salt);
    const newUser = new User({ name, email, password: hanshePassword, phone, address, isVerified, gender });
    const saveuser = await newUser.save();
    res.status(201).json({ message: "User registered successfully!", user: saveuser });
  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error",
      error: error.message
    });
  }
}

const DeleteAllRegisterUsers = async(req, res)=>{
   try{
   const id = req.params.id;
   if(!id) return res.status(404).json({message: "User ID not provided!"});
   const user = await User.findByIdAndDelete(id);
   if(!user) return res.status(404).json({message: "User not found!"});
    res.status(200).json({message: "User deleted successfully!", status: "success", _id: `This is a Deleted user ID : ${id}`});
   }catch(error){
     res.status(500).json({ message: "Server error :", error: error.message });
   }
}

const EmailVerify = async(req, res)=>{
  try{
    const {email, otp} = req.body;
    const { otp: storedOtp, expireOtp } = users[email] || {};
    if(!email || !otp) return res.status(400).json({message: "Email and OTP are required!"});
    if(Date.now() > expireOtp) {
       delete users[email]; // Clear OTP if email is not found
       return res.status(404).json({message: "Otp has expired! Please try again."});
    }

    if(storedOtp == otp){
       delete users[email]; 
       return res.status(201).json({message: "Email verified successfully!"});
    }
    return res.status(404).json({message: "Invalid OTP! Please try again."});
  }catch(error){
    res.status(500).json({message : "Server error :", error : error.message});
  }
}

const UserLogin = async(req, res)=>{
  try{
      const {email, password} = req.body;
      const user = await User.findOne({email});
      if(!user) return res.status(404).json({message : "User not found!"});
      const isVerified = user.isVerified;
      if(!isVerified) return res.status(403).json({message : "Please verify your email first!"});
      const passwordMatch = await bcrypt.compare(password, user.password);
      if(!passwordMatch) return res.status(401).json({message : "Invalid credentials!"});
      const Secret_Key = "abhi_is_a_MERN_stack_developer"
      const token = jwt.sign({ id: user._id }, Secret_Key, { expiresIn: '1h' });
      res.status(201).json({message : "User Logged in successfully!", user : {
        name : user.name,
        email : user.email, 
        password: user.password,
        phone: user.phone,
        address: user.address,
        isVerified: user.isVerified,
        gender: user.gender,
        _id: user._id,
        token: token
       }})
  }catch(error){
    res.status(500).json({message : "Server error :", error : error.message});
  }
}


const Getuser = async(req, res)=>{
  try{
   const id = req.params.id;
   console.log("id is :", id);
   if(!id) return res.status(404).json({message: "User ID not provided!"});
   const user = await User.findById(id);
   if(!user) return res.status(404).json({message: "User not found!"});
    res.status(200).json({message: "User fetched successfully!", data : {
      name : user.name,
      email : user.email,
      password: user.password
    }, status : "success"});
  }catch(error){
    res.status(500).json({
      message : "Server Error :",
      error : error.message
    })
  }
}

const GetallUsers = async(req, res)=>{
  try {
    const users = await User.find({});
    if (!users || users.length === 0) return res.status(404).json({ message: "No users found!" });
    res.status(200).json({ message: "Users fetched successfully!", data: users, status: "success" });
  } catch (error) {
    res.status(500).json({
      message: "Server Error :",
      error: error.message
    });
  }
}

const UpdateUsers = async(req, res)=>{
  try{
      const user = await User.findByIdAndUpdate(req.params.id, {$set: req.body}, {new: true});
      if(!user) return res.status(404).json({message: "User not found!"});
      res.status(200).json({ message: "User updated successfully!", data : user, status: "Success" });
  }catch(error){
    res.status(500).json({
      message: "Server Error :",
      error: error.message
    });
  }
}


const CategoryCreate = async(req, res)=>{
  try{
    const { name, description } = req.body;
    const category = await Category.findOne({name});
    if(category) return res.status(404).json({message: "Category already exists!"});
    const newCategory = new Category({ name, description});
    const savedCategory = await newCategory.save();
    res.status(201).json({ message: "Category created successfully!", category: savedCategory });
  }catch(error){
    res.status(500).json({
      message: "Server Error :",
      error: error.message
    });
  }
}

const SubcategoryCreate = async(req, res)=>{
  try{
    const {name, description, category_id} = req.body;
    const category = await Category.findById(category_id);
    if(!category) return res.status(404).json({message: "Category not found!"});
    const subcategory = await Subcategory.findOne({name, category_id});
    if(subcategory) return res.status(404).json({message: "Subcategory already exists!"});
    const newSubcategory = new Subcategory({ name, description, category_id });
    const savedSubcategory = await newSubcategory.save();
    res.status(201).json({ message: "Subcategory created successfully!", subcategory: savedSubcategory });
  }catch(error){
    res.status(500).json({
      message: "Server Error :",
      error: error.message
    });
  }
}


const UpdateSubcategory = async(req, res)=>{
  try{
    const id = req.params.id;
    const update = await Subcategory.findByIdAndUpdate(id, {$set: req.body}, {new: true});
    if(!update) return res.status(404).json({message: "Subcategory not found!"});
    res.status(200).json({ message: "Subcategory updated successfully!", subcategory: update, status: "Success"});
  }catch(error){
    res.status(500).json({
      message: "Server Error :",
      error: error.message
    });
  }
}


const ProductCreate = async(req, res)=>{
  try{
    const {name, description, price, subcategory_id, color, size} = req.body;
    const subcategory = await Subcategory.findById(subcategory_id);
    if(!subcategory) return res.status(404).json({message: "Subcategory not found!"});
    const product = await Product.findOne({name});
    if(product) return res.status(404).json({message: "Product already exists!"});
    const newProduct = new Product({ name, description, price, subcategory_id, color, size });
    const savedProduct = await newProduct.save();
    res.status(201).json({ message: "Product created successfully!", product: savedProduct });
  }catch(error){
    res.status(500).json({
      message: "Server Error :",
      error: error.message
    });
  }
}


const UpdateProduct = async(req, res) => {
  try {
    const id = req.params.id;
    const update = await Product.findByIdAndUpdate(id, { $set: req.body }, { new: true });
    if (!update) return res.status(404).json({ message: "Product not found!" });
    res.status(200).json({ message: "Product updated successfully!", subcategory: update, status: "Success" });
  } catch (error) {
    res.status(500).json({
      message: "Server Error :",
      error: error.message
    });
  }
}

const ProductDelete = async(req, res)=>{
  try{
   const id = req.params.id;
   const delProduct = await Product.findByIdAndDelete(id);
   if(!delProduct) return res.send("Product id not found!");
   res.send("Product deleted successfully!");
  }catch(error){
    res.send("Server error", error);
  }
}


const getCategory = async(req, res)=>{
  try{
     const findCategory = await Category.find({});
     if(!findCategory || findCategory.length === 0) return res.status(404).json({message: "No categories found!"});
     res.status(200).json({message: "Categories fetched successfully!", data: findCategory, status: "success"});
  }catch(error){
    res.status(500).json({
      message : "Server error :",
      error : error.message
    })
  }
}


const getSubcategory = async(req, res)=>{
  try{
    const findSubcategory = await Subcategory.find({});
    if(!findSubcategory || findSubcategory.length === 0) return res.status(404).json({message: "No subcategories found!"});
    res.status(200).json({message: "Subcategories fetched successfully!", data: findSubcategory, status: "success"});
  }catch (error) {
    res.status(500).json({
      message: "Server error :",
      error: error.message
    })
  }
}

const getProducts = async (req, res) => {
  try {
    const findproduct = await Product.find({});
    if (!findproduct || findproduct.length === 0) return res.status(404).json({ message: "No Products found!" });
    res.status(200).json({ message: "Products fetched successfully!", data: findproduct, status: "success" });
  } catch (error) {
    res.status(500).json({
      message: "Server error :",
      error: error.message
    })
  }
}

const ShippingAddressCreate = async(req, res)=>{
  try{
    const { name, address, city, state, country, zip_code } = req.body;
    const existingAddress = await ShippingAddress.findOne({ name, address, city, state, country, zip_code });
    if (existingAddress) return res.status(404).json({ message: "Shipping address already exists!" });
    const newAddress = new ShippingAddress({ name, address, city, state, country, zip_code });
    const savedAddress = await newAddress.save();
    res.status(201).json({ message: "Shipping address created successfully!", address: savedAddress });
  }
  catch(error){
    res.status(500).json({
      message: "Server Error :",
      error: error.message
    });
  }
};

const ShippingAddressGet = async(req, res)=>{
  try{
   const get = await ShippingAddress.find({});
   if(!get) return res.send("Shipping data not found!");
   res.send({message : "Getting Shipping Address Successfully!", ship : get});
  }catch(error){
    res.send("Server error", error);
  }
}

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);
const Ordercreate = async (req, res) => {
  try {
    const { user_id, product_id, ship_id, quantity } = req.body;
    if (!isValidObjectId(user_id)) return res.status(400).send("Invalid user ID");
    if (!isValidObjectId(ship_id)) return res.status(400).send("Invalid shipping ID");
    const user = await User.findById(user_id);
    if (!user) return res.status(404).send("User not found");
    const shipping = await ShippingAddress.findById(ship_id);
    if (!shipping) return res.status(404).send("Shipping address not found");

    for (const item of product_id){
      if (!isValidObjectId(item.productId)){
        return res.status(400).send(`Invalid product ID: ${item.productId}`);
      }
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(404).send(`Product not found: ${item.productId}`);
      }
    }
    const newOrder = new Order({
      user_id,
      product_id,
      ship_id,
      quantity
    });

    const savedOrder = await newOrder.save();

    res.status(201).json({
      message: "Order created successfully!",
      order: savedOrder
    });

  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};


const OrderGet = async(req, res)=>{
  try{
   const allOrders = await Order.find({});
   if(!allOrders) return res.send({message : "Order not found!"});
   res.send({message : "Getting Order successfully!", order : allOrders});
  }catch(error){
    res.send("Server error :", {error : error.message});
  }
}


const paymentCreate = async (req, res) => {
  try {
    const { user_id, order_id, amount, method, status, date } = req.body;
    if (!isValidObjectId(user_id)) return res.status(400).json({ error: "Invalid user ID" });
    if (!isValidObjectId(order_id)) return res.status(400).json({ error: "Invalid order ID" });
    if (!amount) return res.status(400).json({ error: "Amount is required" });

    const user = await User.findById(user_id);
    if (!user) return res.status(404).json({ error: "User not found" });

    const order = await Order.findById(order_id);
    if (!order) return res.status(404).json({ error: "Order not found" });

    const newPayment = new Payment({
      user_id,
      name: user.name || "",
      email: user.email || "",
      phone: user.phone || "",
      order_id,
      amount,
      method,
      status,
      date
    });
    const savedPayment = await newPayment.save();
    res.status(201).json({
      message: "✅ Payment generated successfully!",
      payment: savedPayment
    });
  } catch (error) {
    res.status(500).json({
      message: "❌ Server error",
      error: error.message
    });
  }
};

const PaymentGet = async(req, res)=>{
  try{
    const allPayments = await Payment.find({});
    if(!allPayments) return res.send("Payments not found!");
    res.send({message : "Payment getting successfully!", allPayments});
  }catch(error){
    res.send("Server error", error);
  }
};


const forgotPassword = async(req, res)=>{
  try{
     const {email} = req.body;
     const user = await User.findOne({email});
     if(!user) return res.status(404).json({message : "Email not found for this user!"});

     const token = crypto.randomBytes(32).toString("hex");
     user.resetToken = crypto.createHash("sha256").update(token).digest("hex");
     user.resetTokenExpire = Date.now() + 15 * 60 * 1000;

     const resetURL = `http://localhost:5000/reset-password/${token}`;
     await sendMail(user.email, "Reset Password URL", `Reset your password using this mail : ${resetURL}`);
     await user.save();
     res.status(201).json({message : "Reset link sent to email", token});
  }catch(error){
    res.status(500).json({ message: "Server error", error })
  }
};


const resetPassword = async(req, res)=>{
  try{
    const {token} = req.params;
    const {newPassword} = req.body;
    
    const Hashedtoken = crypto.createHash("sha256").update(token).digest("hex");
   
    const user = await User.findOne({
       resetToken: Hashedtoken,
       resetTokenExpire: {$gt: Date.now()}
    });

    if(!user) return res.status(400).json({message : "Token is invalid or expired!"});

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(newPassword, salt);

    user.password = hashed;
    user.resetToken = undefined;
    user.resetTokenExpire = undefined;


    await  user.save();
    res.status(201).json({message : "User pasword Reset success!"});

  }catch(error){
    res.status(500).json({message : "Server error", error})
  }
}


module.exports = { Register, Getuser, GetallUsers, 
  CategoryCreate, SubcategoryCreate, ProductCreate, 
  UpdateSubcategory, getCategory, getSubcategory, 
  getProducts, UpdateProduct, ShippingAddressCreate, 
  UserLogin, EmailVerify, DeleteAllRegisterUsers,
  UpdateUsers, Ordercreate, OrderGet, ShippingAddressGet,
  paymentCreate, PaymentGet, ProductDelete,
  forgotPassword, resetPassword
 };
