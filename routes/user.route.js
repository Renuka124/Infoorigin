import express from "express";
import { register, login, logout } from "../controller/user.controller.js";  // Import all functions from the controller

const router = express.Router();

// Route for user registration
router.route("/register").post(register);

// Route for user login
router.route("/login").post(login);

// Route for user logout
router.route("/logout").post(logout);

export default router;
