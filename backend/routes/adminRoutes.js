const express = require("express");
const router = express.Router();

const Admin = require("../models/Admin");


// Create Admin
router.post("/create", async (req, res) => {
  try {
    const admin = new Admin(req.body);

    await admin.save();

    res.status(201).json({
      message: "Admin created successfully",
      admin,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

// Admin Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res.status(404).json({
        message: "Admin not found",
      });
    }

    if (admin.password !== password) {
      return res.status(401).json({
        message: "Wrong password",
      });
    }

    res.json({
      message: "Login success",
      admin,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});


module.exports = router;