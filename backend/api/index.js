const express = require("express");
const http = require("http");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
const cors = require("cors");

const port = process.env.PORT;
const mongoURI = process.env.MONGO_URI;

const authRoutes = require("../routes/auth");
const postRoutes = require("../routes/post");

const app = express();

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

mongoose.connect(mongoURI) .then(() => console.log("MongoDB connected"));

// 🔹 Diagnostic Root Route
app.get("/", (req, res) => {
  res.send("Inkwell API is running... ✒️");
});

// 🔹 Routes
app.use("/auth", authRoutes);

app.use("/post",(req,res,next)=>{
  next();
},postRoutes)
app.use("/uploads", express.static("uploads"));
// server.js
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ✅ Only listen if not running as a Vercel serverless function
if (process.env.NODE_ENV !== 'production') {
  const server = http.createServer({ maxHeaderSize: 32768 }, app);
  server.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}

module.exports = app;