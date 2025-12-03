import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import taskRoutes from "./routes/taskRoutes.js";



import authRoutes from "./routes/authRoutes.js";
// If you have user-related routes, import here:
// import userRoutes from "./routes/userRoutes.js";

dotenv.config();

const app = express();

// MIDDLEWARE
app.use(cors());
app.use(express.json());
app.use(bodyParser.json({ limit: "30mb", extended: true }));

// ROUTES
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
// app.use("/api/user", userRoutes);  // only if you create this

app.get("/", (req, res) => {
  res.send("Hello World - Task Manager API Running ✔");
});

// DATABASE CONNECTION
mongoose
  .connect(process.env.MONGO_URI || "mongodb://localhost:27017/ecommerce")
  .then(() => {
    console.log("✅ Connected to MongoDB");

    app.listen(3000, () => {
      console.log("🚀 Server running on http://localhost:3000");
    });
  })
  .catch((err) => console.log("❌ Database error:", err));
