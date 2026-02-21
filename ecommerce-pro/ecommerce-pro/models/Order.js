import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema({
  userId: String,
  products: Array,
  totalAmount: Number,
  status: { type: String, default: "paid" }
}, { timestamps: true });

export default mongoose.models.Order || mongoose.model("Order", OrderSchema);
