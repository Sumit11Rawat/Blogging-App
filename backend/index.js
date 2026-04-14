const express = require("express");
const http = require("http");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
const cors = require("cors");

const port = process.env.PORT;
const mongoURI = process.env.MONGO_URI;

const authRoutes = require("./routes/auth");
const postRoutes = require("./routes/post");

const app = express();

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cors({
  origin: "http://localhost:5173",  // your React dev server port (Vite default)
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

mongoose.connect(mongoURI) .then(() => console.log("MongoDB connected"));

// 🔹 Routes
app.use("/auth", authRoutes);

app.use("/post",(req,res,next)=>{
  next();
},postRoutes)
app.use("/uploads", express.static("uploads"));
// server.js
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ✅ Use custom HTTP server with larger header size to prevent 431 errors
const server = http.createServer({ maxHeaderSize: 32768 }, app);
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});