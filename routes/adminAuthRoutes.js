import express from "express";
import { adminLogin,getAdminMe,createAdmin,getAllAdmins,updateAdmin,deleteAdmin,changeAdminPassword} from "../controllers/adminAuthController.js";
import adminAuth from "../middleware/adminAuth.js";

const router = express.Router();

// ✅ ONLY LOGIN ROUTE
router.post("/login", adminLogin);
// ✅ GET LOGGED-IN ADMIN
router.get("/me", adminAuth, getAdminMe);

// ✅ CREATE NEW ADMIN (ADMIN ONLY)
router.post("/create", adminAuth, createAdmin);

// ✅ READ ALL ADMINS
router.get("/all", adminAuth, getAllAdmins);


// ✅ update admin
router.put("/update/:id", adminAuth, updateAdmin);

// ❌ delete admin
router.delete("/delete/:id", adminAuth, deleteAdmin);

// 🔐 CHANGE PASSWORD (OLD → NEW)
router.put("/change-password", adminAuth, changeAdminPassword);

export default router;