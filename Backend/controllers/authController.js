const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const asyncHandler = require('express-async-handler');
const User = require('../models/User');

// @desc    Register new user
// @route   POST /api/users
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password, location, role, profilePhoto } = req.body;

    if (!name || !email || !password) {
        res.status(400);
        throw new Error('Please add all required fields');
    }

    // Check if user exists
    const userExists = await User.findOne({ email });

    if (userExists) {
        res.status(400);
        throw new Error('User already exists');
    }

    // Hash password (handled in model pre-save) and create user
    // Hash password (handled in model pre-save) and create user
    const user = await User.create({
        name,
        email,
        password,
        location,
        role: role || 'user',
        profilePhoto
    });

    if (user) {
        res.status(201).json({
            _id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            location: user.location,
            profilePhoto: user.profilePhoto,
            createdAt: user.createdAt,
            token: generateToken(user._id)
        });
    } else {
        res.status(400);
        throw new Error('Invalid user data');
    }
});

// @desc    Authenticate a user
// @route   POST /api/users/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    // Check for user email
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
        res.json({
            _id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            location: user.location,
            profilePhoto: user.profilePhoto,
            createdAt: user.createdAt,
            token: generateToken(user._id)
        });
    } else {
        res.status(400);
        throw new Error('Invalid credentials');
    }
});

// @desc    Get user data
// @route   GET /api/users/me
// @access  Private
const getMe = asyncHandler(async (req, res) => {
    res.status(200).json(req.user);
});

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        user.location = req.body.location || user.location;
        user.profilePhoto = req.body.profilePhoto || user.profilePhoto;

        if (req.body.role) {
            user.role = req.body.role.toLowerCase();
        }

        // Handle password update if needed
        if (req.body.password && req.body.currentPassword) {
            if (await user.matchPassword(req.body.currentPassword)) {
                user.password = req.body.password;
            } else {
                res.status(401);
                throw new Error('Invalid current password');
            }
        }

        if (req.body.privacySettings) {
            user.privacySettings = {
                ...user.privacySettings,
                ...req.body.privacySettings
            };
        }

        const updatedUser = await user.save();

        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            role: updatedUser.role,
            location: updatedUser.location,
            profilePhoto: updatedUser.profilePhoto,
            privacySettings: updatedUser.privacySettings,
            createdAt: updatedUser.createdAt,
            token: generateToken(updatedUser._id)
        });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});


// Generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

module.exports = {
    registerUser,
    loginUser,
    getMe,
    updateUserProfile,
};
