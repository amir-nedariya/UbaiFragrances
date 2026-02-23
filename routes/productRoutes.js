import express from "express";
import upload from "../middleware/upload.js"; // multer memory storage
import {
  addProduct,
  getProducts,
  getAttars,
  getLuxuryAttars,
  getPerfumes,
  getProductById,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";
import adminAuth from "../middleware/adminAuth.js";
const router = express.Router();

// ✅ Category-specific endpoints
router.get("/attar", getAttars);
router.get("/luxury-attar", getLuxuryAttars);
router.get("/perfume", getPerfumes);

// CRUD
router.post("/", adminAuth, upload.single("image"), addProduct);
router.get("/", adminAuth, getProducts);
router.get("/:id",adminAuth, getProductById);
router.put("/:id", adminAuth,upload.single("image"), updateProduct);
router.delete("/:id", adminAuth, deleteProduct);


export default router;
