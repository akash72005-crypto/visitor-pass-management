const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const connectDB = require("./config/db");
const visitorRoutes = require("./routes/visitorRoutes");
const adminRoutes = require("./routes/adminRoutes");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

connectDB();

app.get("/", (req, res) => {
  res.send("Visitor Pass Management System API Running...");
});

app.use("/api/visitors", visitorRoutes);
app.use("/api/admin", adminRoutes);

module.exports = app;