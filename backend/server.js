const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path"); // Ensure correct static path handling
const authRoutes = require("./Router/authRoutes");
const postRoutes = require("./Router/postRoutes");

const app = express();
dotenv.config();

app.use(cors());
app.use(express.json());

// Serve static images correctly
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);

// Connect to MongoDB
mongoose
  .connect(process.env.DB)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB:", err.message);
  });

// Set port correctly (Use PORT instead of port)
const PORT = process.env.PORT || 4000; 

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
