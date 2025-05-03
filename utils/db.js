import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

const connectDB = async () => {
  let connection;
  try {
    connection = await pool.getConnection();
    console.log("✅ MySQL Database Connected");
    return true;
  } catch (error) {
    console.error("❌ MySQL Connection Error:", error.message);
    return false;
  } finally {
    if (connection) connection.release(); // Ensure the connection is released back to the pool
  }
};

export { connectDB, pool };
