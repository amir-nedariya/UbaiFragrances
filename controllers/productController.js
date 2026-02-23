import Product from "../models/Product.js";
import cloudinary from "../config/cloudinary.js";
import mongoose from "mongoose";

// ---------- ADD PRODUCT ----------
export const addProduct = async (req, res) => {
  try {
    let { name, category, price, description, discount, offerActive, offerPercent } = req.body;

    if (!name || !category || !price) {
      return res.status(400).json({ message: "Required fields missing" });
    }

    // Convert numbers
    price = Number(price);
    discount = Number(discount) || 0;
    offerPercent = Number(offerPercent) || 0;
    offerActive = offerActive === "true" || offerActive === true || false;

    // Handle Cloudinary image upload
    let imageData = {};
    if (req.file) {
      const uploadRes = await new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream({ folder: "products" }, (err, result) => {
            if (err) reject(err);
            else resolve(result);
          })
          .end(req.file.buffer);
      });
      imageData = { public_id: uploadRes.public_id, url: uploadRes.secure_url };
    }

    // Calculate final price
    const finalPrice = discount > 0 ? price - (price * discount) / 100 : price;

    const product = await Product.create({
      name,
      category,
      price,
      discount,
      finalPrice,
      description,
      image: imageData,
      offerActive,
      offerPercent,
    });

    res.status(201).json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// ---------- GET ALL PRODUCTS ----------
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// ---------- GET SINGLE PRODUCT ----------
export const getProductById = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid ID" });
  }

  try {
    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// ---------- UPDATE PRODUCT ----------
export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    // Update image if uploaded
    if (req.file) {
      if (product.image?.public_id) {
        await cloudinary.uploader.destroy(product.image.public_id);
      }

      const uploadRes = await new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream({ folder: "products" }, (err, result) => {
            if (err) reject(err);
            else resolve(result);
          })
          .end(req.file.buffer);
      });

      product.image = { public_id: uploadRes.public_id, url: uploadRes.secure_url };
    }

    // Update fields
    if (req.body.name) product.name = req.body.name;
    if (req.body.price) product.price = Number(req.body.price);
    if (req.body.discount) product.discount = Number(req.body.discount);
    if (req.body.category) product.category = req.body.category;
    if (req.body.description) product.description = req.body.description;
    if (req.body.offerActive !== undefined)
      product.offerActive = req.body.offerActive === "true" || req.body.offerActive === true;
    if (req.body.offerPercent !== undefined)
      product.offerPercent = Number(req.body.offerPercent);

    // Recalculate final price
    product.finalPrice =
      product.discount > 0
        ? product.price - (product.price * product.discount) / 100
        : product.price;

    await product.save();
    res.json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// ---------- DELETE PRODUCT ----------
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    if (product.image?.public_id) {
      await cloudinary.uploader.destroy(product.image.public_id);
    }

    await product.deleteOne();
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// ---------- CATEGORY FILTERS ----------
export const getAttars = async (req, res) => {
  try {
    const products = await Product.find({ category: "attar" }).sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

export const getLuxuryAttars = async (req, res) => {
  try {
    const products = await Product.find({ category: "luxury-attar" }).sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

export const getPerfumes = async (req, res) => {
  try {
    const products = await Product.find({ category: "perfume" }).sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};
