const mongoose = require("mongoose");
const Product = require("./products");
const ShippingAddress = require("./shippingAddress");

const OrderSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  products: [Product.schema],
  totalAmounts: { 
    type: Number,
    required: true
  },
  paymentStatus: {
    type: String,
    enum: ["pending", "paid", "failed"],
    default: "pending"
  },
  orderStatus: {
    type: String,
    enum: ["processing", "shipped", "delivered", "cancelled"],
    default: "processing"
  },
  shippingAddress: ShippingAddress.schema
}, { timestamps: true });

module.exports = mongoose.model("Order", OrderSchema);
