import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    product: {
      _id: mongoose.Schema.Types.ObjectId,
      name: String,
      category: String,
      price: Number,
      image: Object,
    },

    customer: {
      username: String,
      mobile: String,
      pincode: String,
      address: String,
    },

    paymentMethod: {
      type: String,
      enum: ["COD", "ONLINE"],
      default: "COD",
    },

    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },

    razorpay: {
      orderId: String,
      paymentId: String,
      signature: String,
    },

    status: {
      type: String,
      enum: ["pending", "confirmed", "shipped", "delivered", "cancelled"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
