const express = require("express");
const mongoose = require("mongoose");
const dotenv =require("dotenv");
dotenv.config();
require("dotenv").config();
const cors=require("cors");
const multer = require("multer");



const port = process.env.PORT;
const mongoURI = process.env.MONGO_URI;

const authRoutes = require("./routes/auth");
const postRoutes=require("./routes/post")
// const verifyToken = require("./middleware/auth");

const app = express();

app.use(express.json());
app.use(cors({
  origin: "http://localhost:5173",  // your React dev server port (Vite default)
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

mongoose.connect(mongoURI) .then(() => console.log("MongoDB connected"));



// 🔹 Storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
// 🔹 Filter for image only
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only images allowed"), false);
  }
};



app.use("/auth",(req, res, next) => {
  // console.log(111);
  next();
}, authRoutes);

app.use("/post",(req,res,next)=>{
  next();
},postRoutes)
app.use("/uploads", express.static("uploads"));

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});