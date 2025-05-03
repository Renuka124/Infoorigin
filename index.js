import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./utils/db.js";
import userRoutes from './routes/user.route.js';  // Add this import statement

dotenv.config();
const port = process.env.PORT || 3000;

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

// API routes
app.use("/api/v1/user", userRoutes );  // Now the import is defined

// Start Server
app.listen(port, async () => {
  const connected = await connectDB();
  if (connected) {
    console.log(`✅ Server running on http://localhost:${port}`);
  } else {
    console.log(`⚠️ Server running on http://localhost:${port}, but DB connection failed`);
  }
});
