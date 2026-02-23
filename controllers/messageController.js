import mongoose from "mongoose";
import Message from "../models/Message.js";

/**
 * @desc Submit a new message (Contact form / Support message)
 */
export const submitMessage = async (req, res) => {
  try {
    const { name,mobile, message } = req.body;

    // Basic validation
    if (!name || !message) {
      return res.status(400).json({
        success: false,
        message: "Name, and message are required",
      });
    }

    const newMessage = await Message.create({
      name,
      mobile,
      message,
    });

    return res.status(201).json({
      success: true,
      data: newMessage,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error while submitting message",
      error: error.message,
    });
  }
};

/**
 * @desc Get all messages (Admin panel)
 */
export const getMessages = async (req, res) => {
  try {
    // optional pagination
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;

    const messages = await Message.find()
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await Message.countDocuments();

    return res.json({
      success: true,
      total,
      page,
      limit,
      data: messages,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch messages",
      error: error.message,
    });
  }
};

/**
 * @desc Delete a message by ID
 */
export const deleteMessage = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate MongoDB ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid message ID",
      });
    }

    const deleted = await Message.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Message not found",
      });
    }

    return res.json({
      success: true,
      message: "Message deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error while deleting message",
      error: error.message,
    });
  }
};
