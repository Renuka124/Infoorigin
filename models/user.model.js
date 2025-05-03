import { pool } from '../utils/db.js';  // Correct import for pool from db.js

const User = {
  createUser: async ({ fullName, email, username, phoneNumber, password, city, skills, role }) => {
    try {
      const query = "INSERT INTO users (fullName, email, username, phoneNumber, password, city, skills, role) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
      const [result] = await pool.execute(query, [fullName, email, username, phoneNumber, password, city, skills, role]);
      return result;
    } catch (error) {
      console.error("Database Insert Error:", error);
      throw new Error("Database Insert Error");
    }
  },

  getUserByEmail: async (email) => {
    try {
      const query = "SELECT * FROM users WHERE email = ?";
      const [rows] = await pool.execute(query, [email]);
      return rows.length > 0 ? rows[0] : null;
    } catch (error) {
      console.error("Database Query Error:", error);
      return null;
    }
  },

  getUserByUsername: async (username) => {
    try {
      const query = "SELECT * FROM users WHERE username = ?";
      const [rows] = await pool.execute(query, [username]);
      return rows.length > 0 ? rows[0] : null;
    } catch (error) {
      console.error("Database Query Error:", error);
      return null;
    }
  }
};

export default User;
