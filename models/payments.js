const mongoose = require("mongoose");

const PaymentSchema = new mongoose.Schema({
  user_id : {type: String, required: true},
  order_id : {type: mongoose.Schema.Types.ObjectId, ref : "Order"},
  amount : {type: Number, required: true},
  method: { type: String, enum: ["Card", "Cash", "UPI", "NetBanking", "Other"], default: "Other" },
  status: {type: String, enum: ["Paid", "Pending", "Failed"], default: "Paid"},
  date: { type: Date, default: Date.now}
}, {timestamps : true});

module.exports = mongoose.model("Payment", PaymentSchema);