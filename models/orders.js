const mongoose = require("mongoose");

const OrderSchma = new mongoose.Schema({
  user_id : {type: mongoose.Schema.Types.ObjectId, ref: "User"},
  product_id: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
      quantity: { type: Number, required: true, default: 0 },
    }
  ],
  ship_id: { type: mongoose.Schema.Types.ObjectId, ref: "ShippingAddress"},
  status: {type: String, default: "Pending"}
}, {timestamps: true});

module.exports = mongoose.model("Order", OrderSchma);
