import bcrypt from "bcryptjs";
import User from "../models/user.model.js";  // MySQL User model

export const register = async (req, res) => {
    try {
      const { fullName, email, username, phoneNumber, password, city, skills, role } = req.body;
  
      // Validate role
      const validRoles = ['candidate', 'recruiter'];
      if (!validRoles.includes(role)) {
        return res.status(400).json({
          message: "Invalid role. The role must be either 'candidate' or 'recruiter'.",
          success: false,
        });
      }
  
      // Ensure that skills is an array
      const skillsArray = skills.split(',').map(skill => skill.trim());  // Convert skills to an array
  
      // Check if required fields are present
      if (!fullName || !email || !username || !password) {
        return res.status(400).json({
          message: "Full name, email, username, and password are required",
          success: false,
        });
      }
  
      // Check if the email already exists in the database
      const existingEmail = await User.getUserByEmail(email);
      if (existingEmail) {
        return res.status(400).json({
          message: "User already exists with this email",
          success: false,
        });
      }
  
      // Check if the username already exists in the database
      const existingUsername = await User.getUserByUsername(username);
      if (existingUsername) {
        return res.status(400).json({
          message: "Username is already taken",
          success: false,
        });
      }
  
      // Hash the password before storing
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Insert the new user into the database
      const result = await User.createUser({
        fullName,
        email,
        username,
        phoneNumber,
        password: hashedPassword,
        city,
        skills: JSON.stringify(skillsArray), // Proper JSON format for skills
        role,
      });
  
      // Respond with success message
      return res.status(201).json({
        message: "Account created successfully.",
        success: true,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: "Server error during registration",
        success: false,
      });
    }
  };
  
