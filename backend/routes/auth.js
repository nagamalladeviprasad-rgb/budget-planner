const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

// Simple RFC 5322 Compliant Email Verification RegEx
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

// REGISTER
router.post("/register", async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Secure Input Validation
        if (
            typeof name !== "string" ||
            typeof email !== "string" ||
            typeof password !== "string" ||
            !name.trim() ||
            !EMAIL_REGEX.test(email.trim()) || 
            password.length < 6 ||
            password.length > 72 // Bcrypt maximum string calculation capacity limit
        ) {
            return res.status(400).json({
                message: "Enter your name, a valid email address, and a password between 6 and 72 characters."
            });
        }

        const normalizedEmail = email.trim().toLowerCase();

        // Check for an existing account
        const existingUser = await User.findOne({ email: normalizedEmail });
        if (existingUser) {
            return res.status(409).json({
                message: "An account with this email already exists."
            });
        }

        // Hash the password safely using 10 salt rounds
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({
            name: name.trim(),
            email: normalizedEmail,
            password: hashedPassword
        });

        await user.save();

        return res.status(201).json({
            message: "Registration successful. Please log in."
        });
    } catch (error) {
        console.error("Registration error:", error.message);

        if (error.code === 11000) {
            return res.status(409).json({
                message: "An account with this email already exists."
            });
        }

        return res.status(500).json({
            message: "Registration failed. Please try again."
        });
    }
});

// LOGIN
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        if (
            typeof email !== "string" ||
            typeof password !== "string" ||
            !email.trim() ||
            !password
        ) {
            return res.status(400).json({
                message: "Please enter your email and password."
            });
        }

        const normalizedEmail = email.trim().toLowerCase();
        const user = await User.findOne({ email: normalizedEmail });

        // Security Fix: Prevent User Enumeration via Timing Attacks
        // If user isn't found, we execute a fake compare round to balance calculation time.
        let passwordMatch = false;
        if (user) {
            passwordMatch = await bcrypt.compare(password, user.password);
        } else {
            // Dummy hash matching your standard schema architecture structure
            const dummyHash = "$2a$10$NxkEJWcSn.N5eT.P58.tGuZ1.xS3z9W4eY/4vK9.c0yB8Z8e8y8u.";
            await bcrypt.compare(password, dummyHash);
        }

        if (!user || !passwordMatch) {
            return res.status(401).json({
                message: "Invalid email or password."
            });
        }

        // Guard environment variable configurations
        if (!process.env.JWT_SECRET) {
            console.error("CRITICAL CRASH: JWT_SECRET is missing from .env configurations.");
            return res.status(500).json({
                message: "Login is temporarily unavailable due to server setup configurations."
            });
        }

        // Issue token
        const token = jwt.sign(
            { userId: user._id.toString() },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        return res.json({
            message: "Login successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });
    } catch (error) {
        console.error("Login error:", error.message);
        return res.status(500).json({
            message: "Login failed. Please try again."
        });
    }
});

module.exports = router;
