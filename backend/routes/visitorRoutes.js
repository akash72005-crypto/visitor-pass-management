const express = require("express");
const router = express.Router();
const Visitor = require("../models/Visitor");

// Add Visitor
router.post("/add", async (req, res) => {

  try {

    const visitor = new Visitor({
      ...req.body,
      status: "Pending"
    });

    await visitor.save();

    res.status(201).json({
      message: "Visitor added successfully",
      visitor
    });

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

});


// Get All Visitors
router.get("/all", async (req, res) => {

  try {

    const visitors = await Visitor.find();

    res.status(200).json(visitors);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

});


// Update Visitor Status (Approve / Reject)
router.put("/status/:id", async (req, res) => {

  try {

    const visitor = await Visitor.findByIdAndUpdate(
      req.params.id,
      {
        status: req.body.status
      },
      {
        new: true
      }
    );


    res.json({
      message: "Status updated",
      visitor
    });


  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

});


// Get Single Visitor (For Visitor Pass)
router.get("/:id", async (req, res) => {

  try {

    const visitor = await Visitor.findById(req.params.id);


    if (!visitor) {

      return res.status(404).json({
        message: "Visitor not found"
      });

    }


    res.json(visitor);


  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

});
// Check Out Visitor
router.put("/checkout/:id", async (req, res) => {

  try {

    const visitor = await Visitor.findByIdAndUpdate(
      req.params.id,
      {
        exitTime: new Date(),
        status: "Checked Out"
      },
      {
        new: true
      }
    );

    if (!visitor) {
      return res.status(404).json({
        message: "Visitor not found"
      });
    }

    res.json({
      message: "Visitor checked out successfully",
      visitor
    });

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

});

module.exports = router;