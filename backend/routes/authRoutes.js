import express from 'express';
import User from '../models/User.js';
import jwt from "jsonwebtoken";
import dotenv from 'dotenv';
dotenv.config();
import { Router } from 'express';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Helper function to generate a JWT token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

// This route is protected
router.get('/profile', protect, (req, res) => {
    // req.user is available here due to the middleware
    res.json({
        id: req.user._id,
        email: req.user.email,
        message: `Welcome ${req.user.email}, you are authenticated!`
    });
});

// 1. User Registration (Signup)
router.post('/register', async (req, res) => {
    const { email, password, name, role } = req.body;

    try {
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const user = await User.create({ email, password, name, role });
        
        res.status(201).json({
            _id: user._id,
            email: user.email,
            token: generateToken(user._id), // Send back a token immediately
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// 2. User Login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    // Use the custom method defined in the schema to check the password
    if (user && (await user.matchPassword(password))) {
        res.json({
            _id: user._id,
            email: user.email,
            token: generateToken(user._id),
        });
    } else {
        res.status(401).json({ message: 'Invalid email or password' });
    }
});

export default router;
