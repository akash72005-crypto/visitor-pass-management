const mongoose = require("mongoose");

const visitorSchema = new mongoose.Schema(
  {
    visitorName: {
      type: String,
      required: true,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
    },

    employeeName: {
      type: String,
      required: true,
    },

    employeeEmail: {
      type: String,
      required: true,
    },

    visitDate: {
      type: Date,
      required: true,
    },

    expectedArrivalTime: {
      type: String,
      required: true,
    },

    purpose: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: [
        "Pending",
        "Approved",
        "Rejected",
        "Checked In",
        "Checked Out",
        "Cancelled",
      ],
      default: "Pending",
    },

    remarks: {
      type: String,
      default: "",
    },

    checkInTime: {
      type: Date,
      default: null,
    },

    checkOutTime: {
      type: Date,
      default: null,
    },

    activityHistory: [
  {
    action: {
      type: String,
      required: true,
    },
    dateTime: {
      type: Date,
      default: Date.now,
    },
    performedBy: {
      type: String,
      default: "System",
    },
  },
],
    createdBy: {
      type: String,
      default: "Receptionist",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Visitor", visitorSchema);