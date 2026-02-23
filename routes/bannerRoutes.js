import express from "express";
import upload from "../middleware/upload.js";
import adminAuth from "../middleware/adminAuth.js";
import {
  createBanner,
  getBanners,
  getAllBanners,
  deleteBanner,
  toggleBanner,
  updateBannerOrder,
} from "../controllers/bannerController.js";

const router = express.Router();

/* PUBLIC */
router.get("/", getBanners);

/* ADMIN */
router.get("/all", adminAuth, getAllBanners);
router.post("/", adminAuth, upload.single("image"), createBanner);
router.delete("/:id", adminAuth, deleteBanner);
router.put("/toggle/:id", adminAuth, toggleBanner);

router.put("/order/:id", adminAuth, updateBannerOrder);
export default router;