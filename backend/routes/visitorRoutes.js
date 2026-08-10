const express = require("express");
const router = express.Router();
const Visitor = require("../models/Visitor");

// ==========================================
// 1. REGISTER VISITOR
// ==========================================
router.post("/create", async (req, res) => {
  try {
    const {
      visitorName,
      phone,
      employeeName,
      employeeEmail,
      visitDate,
      expectedArrivalTime,
      purpose,
    } = req.body;

    if (
      !visitorName ||
      !phone ||
      !employeeName ||
      !employeeEmail ||
      !visitDate ||
      !expectedArrivalTime ||
      !purpose
    ) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const visitDay = new Date(visitDate);
    const today = new Date();

    today.setHours(0, 0, 0, 0);
    visitDay.setHours(0, 0, 0, 0);

    if (visitDay < today) {
      return res.status(400).json({
        message: "Visit date cannot be earlier than today",
      });
    }

    const now = new Date();

    if (visitDay.getTime() === today.getTime()) {
      const [hours, minutes] =
        expectedArrivalTime.split(":");

      const arrival = new Date();

      arrival.setHours(
        Number(hours),
        Number(minutes),
        0,
        0
      );

      if (arrival < now) {
        return res.status(400).json({
          message:
            "Expected arrival time cannot be earlier than current time",
        });
      }
    }

    // Duplicate visitor on same date
    const duplicate = await Visitor.findOne({
      phone,
      visitDate: {
        $gte: visitDay,
        $lt: new Date(
          visitDay.getTime() +
            24 * 60 * 60 * 1000
        ),
      },
      status: {
        $nin: ["Cancelled", "Rejected"],
      },
    });

    if (duplicate) {
      return res.status(400).json({
        message:
          "Visitor already registered for this date",
      });
    }

    // Active visit check
    const activeVisit = await Visitor.findOne({
      phone,
      status: {
        $in: [
          "Pending",
          "Approved",
          "Checked In",
        ],
      },
    });

    if (activeVisit) {
      return res.status(400).json({
        message:
          "Visitor already has an active visit",
      });
    }

    // Employee pending request limit
    const pendingCount =
      await Visitor.countDocuments({
        employeeEmail,
        status: "Pending",
      });

    if (pendingCount >= 3) {
      return res.status(400).json({
        message:
          "Employee already has 3 pending visitor requests",
      });
    }

    const visitor = new Visitor({
      visitorName,
      phone,
      employeeName,
      employeeEmail,
      visitDate,
      expectedArrivalTime,
      purpose,

      activityHistory: [
        {
          action: "Created",
          dateTime: new Date(),
          performedBy: "Receptionist",
        },
      ],
    });

    await visitor.save();

    res.status(201).json({
      message:
        "Visitor request created successfully",
      visitor,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

// ==========================================
// 2. GET ALL VISITORS
// ==========================================
router.get("/", async (req, res) => {
  try {
    const visitors = await Visitor.find().sort({
      createdAt: -1,
    });

    res.json(visitors);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

// ==========================================
// 3. EMPLOYEE PENDING VISITORS
// ==========================================
router.get("/employee/:email", async (req, res) => {
  try {
    const visitors = await Visitor.find({
      employeeEmail: req.params.email,
      status: "Pending",
    }).sort({
      createdAt: -1,
    });

    res.json(visitors);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});
// Search and Filter Visitors
router.get("/search", async (req, res) => {
  try {
    const {
      visitorName,
      employeeName,
      visitDate,
      status,
    } = req.query;

    const filter = {};

    if (visitorName && visitorName.trim() !== "") {
      filter.visitorName = {
        $regex: visitorName.trim(),
        $options: "i",
      };
    }

    if (employeeName && employeeName.trim() !== "") {
      filter.employeeName = {
        $regex: employeeName.trim(),
        $options: "i",
      };
    }

    if (status && status.trim() !== "") {
      filter.status = status;
    }

    if (visitDate && visitDate.trim() !== "") {
      const start = new Date(visitDate);
      start.setHours(0, 0, 0, 0);

      const end = new Date(visitDate);
      end.setHours(23, 59, 59, 999);

      filter.visitDate = {
        $gte: start,
        $lte: end,
      };
    }

    console.log("SEARCH FILTER:", filter);

    const visitors = await Visitor.find(filter).sort({
      createdAt: -1,
    });

    res.json(visitors);

  } catch (error) {
    console.log("SEARCH ERROR:", error);

    res.status(500).json({
      message: error.message,
    });
  }
});
// ==========================================
// 5. VISITOR REPORTS
// ==========================================
router.get("/reports", async (req, res) => {
  try {
    const {
      period,
      startDate,
      endDate,
    } = req.query;

    const now = new Date();

    let start;
    let end;

    if (period === "today") {
      start = new Date();
      start.setHours(0, 0, 0, 0);

      end = new Date();
      end.setHours(23, 59, 59, 999);
    } else if (period === "week") {
      start = new Date();
      start.setDate(now.getDate() - 6);
      start.setHours(0, 0, 0, 0);

      end = new Date();
      end.setHours(23, 59, 59, 999);
    } else if (
      period === "custom" &&
      startDate &&
      endDate
    ) {
      start = new Date(startDate);
      start.setHours(0, 0, 0, 0);

      end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
    } else {
      return res.status(400).json({
        message: "Invalid report filter",
      });
    }

    const visitors = await Visitor.find({
      visitDate: {
        $gte: start,
        $lte: end,
      },
    });

    const report = {
      totalVisitors: visitors.length,

      pending: visitors.filter(
        (v) => v.status === "Pending"
      ).length,

      approved: visitors.filter(
        (v) => v.status === "Approved"
      ).length,

      rejected: visitors.filter(
        (v) => v.status === "Rejected"
      ).length,

      checkedIn: visitors.filter(
        (v) => v.status === "Checked In"
      ).length,

      checkedOut: visitors.filter(
        (v) => v.status === "Checked Out"
      ).length,

      cancelled: visitors.filter(
        (v) => v.status === "Cancelled"
      ).length,
    };

    res.json({
      period,
      report,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

// ==========================================
// 6. GET SINGLE VISITOR
// IMPORTANT: Keep this AFTER /search and /reports
// ==========================================
router.get("/:id", async (req, res) => {
  try {
    const visitor = await Visitor.findById(
      req.params.id
    );

    if (!visitor) {
      return res.status(404).json({
        message: "Visitor not found",
      });
    }

    res.json(visitor);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: error.message,
    });
  }
});

// ==========================================
// 7. APPROVE VISITOR
// ==========================================
router.put("/:id/approve", async (req, res) => {
  try {
    const { remarks } = req.body;

    const visitor = await Visitor.findById(
      req.params.id
    );

    if (!visitor) {
      return res.status(404).json({
        message: "Visitor not found",
      });
    }

    if (visitor.status !== "Pending") {
      return res.status(400).json({
        message:
          "Only pending visitors can be approved",
      });
    }

    visitor.status = "Approved";
    visitor.remarks = remarks || "";

    visitor.activityHistory.push({
      action: "Approved",
      dateTime: new Date(),
      performedBy: "Employee",
    });

    await visitor.save();

    res.json({
      message:
        "Visitor approved successfully",
      visitor,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

// ==========================================
// 8. REJECT VISITOR
// ==========================================
router.put("/:id/reject", async (req, res) => {
  try {
    const { remarks } = req.body;

    const visitor = await Visitor.findById(
      req.params.id
    );

    if (!visitor) {
      return res.status(404).json({
        message: "Visitor not found",
      });
    }

    if (visitor.status !== "Pending") {
      return res.status(400).json({
        message:
          "Only pending visitors can be rejected",
      });
    }

    visitor.status = "Rejected";
    visitor.remarks = remarks || "";

    visitor.activityHistory.push({
      action: "Rejected",
      dateTime: new Date(),
      performedBy: "Employee",
    });

    await visitor.save();

    res.json({
      message:
        "Visitor rejected successfully",
      visitor,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

// ==========================================
// 9. CHECK IN VISITOR
// ==========================================
router.put("/:id/checkin", async (req, res) => {
  try {
    const visitor = await Visitor.findById(
      req.params.id
    );

    if (!visitor) {
      return res.status(404).json({
        message: "Visitor not found",
      });
    }

    if (visitor.status !== "Approved") {
      return res.status(400).json({
        message:
          "Only approved visitors can be checked in",
      });
    }

    if (visitor.checkInTime) {
      return res.status(400).json({
        message:
          "Visitor is already checked in",
      });
    }

    visitor.status = "Checked In";
    visitor.checkInTime = new Date();

    visitor.activityHistory.push({
      action: "Checked In",
      dateTime: new Date(),
      performedBy: "Receptionist",
    });

    await visitor.save();

    res.json({
      message:
        "Visitor checked in successfully",
      visitor,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

// ==========================================
// 10. CHECK OUT VISITOR
// ==========================================
router.put("/:id/checkout", async (req, res) => {
  try {
    const visitor = await Visitor.findById(
      req.params.id
    );

    if (!visitor) {
      return res.status(404).json({
        message: "Visitor not found",
      });
    }

    if (visitor.status !== "Checked In") {
      return res.status(400).json({
        message:
          "Visitor is not currently checked in",
      });
    }

    const checkOutTime = new Date();

    if (
      checkOutTime <= visitor.checkInTime
    ) {
      return res.status(400).json({
        message:
          "Check-out time must be later than check-in time",
      });
    }

    visitor.status = "Checked Out";
    visitor.checkOutTime = checkOutTime;

    visitor.activityHistory.push({
      action: "Checked Out",
      dateTime: checkOutTime,
      performedBy: "Receptionist",
    });

    await visitor.save();

    res.json({
      message:
        "Visitor checked out successfully",
      visitor,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

// ==========================================
// 11. CANCEL VISITOR
// ==========================================
router.put("/:id/cancel", async (req, res) => {
  try {
    const visitor = await Visitor.findById(
      req.params.id
    );

    if (!visitor) {
      return res.status(404).json({
        message: "Visitor not found",
      });
    }

    if (
      visitor.status !== "Pending" &&
      visitor.status !== "Approved"
    ) {
      return res.status(400).json({
        message:
          "Only pending or approved visitors can be cancelled",
      });
    }

    visitor.status = "Cancelled";

    visitor.activityHistory.push({
      action: "Cancelled",
      dateTime: new Date(),
      performedBy: "Receptionist",
    });

    await visitor.save();

    res.json({
      message:
        "Visitor cancelled successfully",
      visitor,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

// ==========================================
// 12. ACTIVITY HISTORY
// ==========================================
router.get("/:id/activity", async (req, res) => {
  try {
    const visitor = await Visitor.findById(
      req.params.id
    );

    if (!visitor) {
      return res.status(404).json({
        message: "Visitor not found",
      });
    }

    res.json({
      visitor: visitor.visitorName,
      activityHistory:
        visitor.activityHistory,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

module.exports = router;