import bcrypt from "bcryptjs";
import { pool } from "../utils/db.js"; // Correct import for pool from db.js

const User = {
  // Create a new user
  createUser: async ({ fullName, email, username, phoneNumber, password, city, skills, role }) => {
    try {
      // Hash the password before storing it
      const hashedPassword = await bcrypt.hash(password, 10);
      
      // SQL query to insert the new user into the database
      const query = "INSERT INTO users (fullName, email, username, phoneNumber, password, city, skills, role) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
      const [result] = await pool.execute(query, [fullName, email, username, phoneNumber, hashedPassword, city, skills, role]);

      // Return the result which contains the inserted user ID and other info
      return result;
    } catch (error) {
      console.error("Database Insert Error:", error);
      throw new Error("Error inserting user into the database: " + error.message); // Detailed error message
    }
  },

  // Get a user by email
  getUserByEmail: async (email) => {
    try {
      const query = "SELECT * FROM users WHERE email = ?";
      const [rows] = await pool.execute(query, [email]);

      return rows.length > 0 ? rows[0] : null; // Return user if found, else null
    } catch (error) {
      console.error("Database Query Error:", error);
      throw new Error("Error querying user by email: " + error.message); // Detailed error message
    }
  },

  // Get a user by username
  getUserByUsername: async (username) => {
    try {
      const query = "SELECT * FROM users WHERE username = ?";
      const [rows] = await pool.execute(query, [username]);

      return rows.length > 0 ? rows[0] : null; // Return user if found, else null
    } catch (error) {
      console.error("Database Query Error:", error);
      throw new Error("Error querying user by username: " + error.message); // Detailed error message
    }
  }
};

export default User;
