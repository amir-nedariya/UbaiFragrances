import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    category: {
      type: String,
      required: true,
      enum: ["attar", "luxury-attar", "perfume"],
    },
    price: { type: Number, required: true },
    discount: { type: Number, default: 0, min: 0, max: 100 },
    finalPrice: { type: Number },
    description: { type: String, default: "" },
    image: {
      public_id: String,
      url: String,
    },
    offerActive: { type: Boolean, default: false },
    offerPercent: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// ✅ SINGLE SOURCE OF TRUTH
productSchema.pre("save", function () {
  let price = this.price || 0;

  if (this.offerActive && this.offerPercent > 0) {
    price = price - (price * this.offerPercent) / 100;
  } else if (this.discount > 0) {
    price = price - (price * this.discount) / 100;
  }

  this.finalPrice = price;
});

export default mongoose.model("Product", productSchema);
