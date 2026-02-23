import express from "express";
import {
  placeOrder,
  getOrders,
  getOrdersByMobile, // ✅ new for user
  updateOrderStatus,
  deleteOrder,
} from "../controllers/orderController.js";
import adminAuth from "../middleware/adminAuth.js";
const router = express.Router();

// ------------------- ORDERS -------------------

// 1️⃣ Place a new order (anyone)
router.post("/", placeOrder);

// 2️⃣ Get all orders (ADMIN)
router.get("/", adminAuth, getOrders);

// 3️⃣ Track orders by mobile (USER)
router.get("/track", getOrdersByMobile); 
// Example: GET /api/orders/track?mobile=9876543210

// 4️⃣ Update order status (ADMIN only)
router.put("/:id/status", adminAuth, updateOrderStatus);

// 5️⃣ Delete an order (ADMIN)
router.delete("/:id", adminAuth, deleteOrder);

export default router;
