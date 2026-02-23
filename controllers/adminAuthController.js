import Admin from "../models/Admin.js";
import jwt from "jsonwebtoken";

/* ---------------- LOGIN (already) ---------------- */
export const adminLogin = async (req, res) => {
  try {
    const { mobile, password } = req.body;

    if (!mobile || !password) {
      return res.status(400).json({
        success: false,
        message: "Mobile and password are required",
      });
    }

    const admin = await Admin.findOne({ mobile });

    if (!admin || admin.password !== password) {
      return res.status(401).json({
        success: false,
        message: "Invalid mobile number or password",
      });
    }

    // const token = jwt.sign(
    //   { id: admin._id, role: admin.role },
    //   process.env.JWT_SECRET,
    //   { expiresIn: "7d" }
    // );
    const token = jwt.sign(
  { id: admin._id, role: admin.role },
  process.env.JWT_SECRET,
  {
    expiresIn: process.env.JWT_EXPIRES_IN,
  }
);
//     const token = jwt.sign(
//   { id: admin._id, role: admin.role },
//   process.env.JWT_SECRET,
//   {
//     expiresIn: process.env.JWT_EXPIRES_IN || "7d",
//   }
// );

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

/* ---------------- /me (NEW) ---------------- */
export const getAdminMe = async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin.id).select("-password");

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }

    res.status(200).json({
      success: true,
      admin,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

/* ---------------- CREATE NEW ADMIN ---------------- */
export const createAdmin = async (req, res) => {
  try {
    const { name, mobile, password } = req.body;

    // validation
    if (!name || !mobile || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // check existing admin
    const exists = await Admin.findOne({ mobile });
    if (exists) {
      return res.status(400).json({
        success: false,
        message: "Admin with this mobile already exists",
      });
    }

    // create admin
    const admin = await Admin.create({
      name,
      mobile,
      password, // ❌ plain password (as per your choice)
      role: "admin",
    });

    res.status(201).json({
      success: true,
      message: "New admin created successfully",
      admin: {
        id: admin._id,
        name: admin.name,
        mobile: admin.mobile,
        role: admin.role,
      },
    });
  } catch (error) {
    console.error("Create Admin Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

/* ---------------- GET ALL ADMINS ---------------- */
export const getAllAdmins = async (req, res) => {
  try {
    const admins = await Admin.find().select("-password");

    res.status(200).json({
      success: true,
      count: admins.length,
      admins,
    });
  } catch (error) {
    console.error("Get All Admins Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};



/* ---------------- UPDATE ADMIN ---------------- */
export const updateAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, mobile, password } = req.body;

    // prevent self update restriction (optional)
    if (req.admin.id === id) {
      return res.status(400).json({
        success: false,
        message: "You cannot update your own admin details",
      });
    }

    const admin = await Admin.findById(id);
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }

    if (name) admin.name = name;
    if (mobile) admin.mobile = mobile;
    if (password) admin.password = password; // ❌ no hash

    await admin.save();

    res.status(200).json({
      success: true,
      message: "Admin updated successfully",
      admin: {
        id: admin._id,
        name: admin.name,
        mobile: admin.mobile,
        role: admin.role,
      },
    });
  } catch (error) {
    console.error("Update Admin Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

/* ---------------- DELETE ADMIN ---------------- */
export const deleteAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    // ❌ prevent self delete
    if (req.admin.id === id) {
      return res.status(400).json({
        success: false,
        message: "You cannot delete your own admin account",
      });
    }

    const admin = await Admin.findById(id);
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }

    await admin.deleteOne();

    res.status(200).json({
      success: true,
      message: "Admin deleted successfully",
    });
  } catch (error) {
    console.error("Delete Admin Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

/* ---------------- CHANGE ADMIN PASSWORD ---------------- */
export const changeAdminPassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    // validation
    if (!oldPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Old password and new password are required",
      });
    }

    // logged-in admin
    const admin = await Admin.findById(req.admin.id);

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }

    // check old password (PLAIN TEXT)
    if (admin.password !== oldPassword) {
      return res.status(400).json({
        success: false,
        message: "Old password is incorrect",
      });
    }

    // update password (PLAIN TEXT)
    admin.password = newPassword;
    await admin.save();

    res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    console.error("Change Password Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};