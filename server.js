import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";

import adminAuthRoutes from "./routes/adminAuthRoutes.js";
import bannerRoutes from "./routes/bannerRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";

dotenv.config();
connectDB();

const app = express();

// ✅ FIXED CORS
app.use(
  cors({
    origin: ["http://localhost:5173", "https://ubaifragrances.netlify.app"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ✅ parse JSON + forms
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ API routes
app.use("/api/admin", adminAuthRoutes);
app.use("/api/banners", bannerRoutes);
app.use("/api/products", productRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payment", paymentRoutes);


app.get("/", (req, res) => res.send("API Running"));

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server running on ${PORT}`));
// ✅ NETWORK ENABLED SERVER
const PORT = process.env.PORT || 5000;
const HOST = "0.0.0.0";

app.listen(PORT, HOST, () => {
  console.log("🚀 Server running on:");
  console.log(`👉 http://localhost:${PORT}`);
  console.log(`👉 http://10.201.29.163:${PORT}`); // apna LAN IP yaha rakho
});