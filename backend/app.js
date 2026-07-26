const express = require("express");
const cors = require("cors");


const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "Welcome to NagaEd Backend API 🚀",
  });
});

app.use("/api", authRoutes);
app.use("/api", userRoutes);

module.exports = app;