import jwt from 'jsonwebtoken'; 
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
  
  export const login = async (req, res) => {
    try {
      const { username, password } = req.body;
  
      if (!username || !password) {
        return res.status(400).json({
          message: "Username or password is missing",
          success: false,
        });
      }
  
      // Get the user by username
      let user = await User.getUserByUsername(username);
      if (!user) {
        return res.status(400).json({
          message: "Incorrect username or password",
          success: false,
        });
      }
  
      // Compare password with the hashed password in the database
      const isPasswordMatch = await bcrypt.compare(password, user.password);
      if (!isPasswordMatch) {
        return res.status(400).json({
          message: "Incorrect username or password",
          success: false,
        });
      }
  
      // Prepare the JWT payload
      const tokenData = {
        userId: user.id,  // Assuming the column for user ID is 'id'
      };
  
      // Sign the token
      const token = await jwt.sign(tokenData, process.env.SECRET_KEY, { expiresIn: "1d" });
  
      // Prepare user object without the password field
      const userResponse = {
        _id: user.id,
        fullName: user.fullName,
        email: user.email,
        username: user.username,
        phoneNumber: user.phoneNumber,
        city: user.city,
        skills: user.skills,
        role: user.role,
      };
  
      return res
        .status(200)
        .cookie("token", token, {
          maxAge: 1 * 24 * 60 * 60 * 1000,
          httpOnly: true,
          sameSite: "strict",
        })
        .json({
          message: `Welcome back ${userResponse.fullName}`,
          user: userResponse,
          token,
          success: true,
        });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: "Server error during login",
        success: false,
      });
    }
  };

  export const logout = async (req, res) => {
    try {
      return res.status(200).cookie("token", "", { maxAge: 0 }).json({
        message: "Logged out successfully",
        success: true,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: "Server error during logout",
        success: false,
      });
    }
  };
  
