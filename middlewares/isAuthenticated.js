import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import db from "../db";  // Assuming db is your MySQL connection setup
dotenv.config();

const isAuthenticated = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ message: "User not authenticated", success: false });
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    const userId = decoded.userId;

    // Query the database to check if the user exists
    const query = "SELECT * FROM users WHERE id = ?";
    db.query(query, [userId], (err, results) => {
      if (err) {
        return res.status(500).json({ message: "Database error", success: false });
      }

      if (results.length === 0) {
        return res.status(401).json({ message: "User not found", success: false });
      }

      // Attach user ID to request object
      req.id = userId;
      next();
    });
  } catch (error) {
    return res.status(401).json({ message: "Authentication error", success: false });
  }
};

export default isAuthenticated;
