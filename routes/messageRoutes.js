import express from "express";
import {
  submitMessage,
  getMessages,
  deleteMessage,
} from "../controllers/messageController.js";

import adminAuth from "../middleware/adminAuth.js";
const router = express.Router();

router.post("/", submitMessage);
router.get("/", adminAuth, getMessages);
router.delete("/:id", adminAuth, deleteMessage);
export default router;
