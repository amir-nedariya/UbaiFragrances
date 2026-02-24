import express from "express";
import { createRazorpayOrder, verifyPayment } from "../controllers/paymentController.js";
import adminAuth from "../middleware/adminAuth.js";
const router = express.Router();

router.post("/create", createRazorpayOrder);
router.post("/verify", adminAuth, verifyPayment);

export default router;
