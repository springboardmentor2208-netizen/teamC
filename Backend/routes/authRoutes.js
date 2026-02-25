const express = require('express');
const router = express.Router();
const {
    registerUser,
    loginUser,
    verifyOTP,
    resendOTP,
    getMe,
    updateUserProfile,
    forgotPassword,
    resetPassword,
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', registerUser);
router.post('/register', registerUser);
router.post('/verify-otp', verifyOTP);
router.post('/resend-otp', resendOTP);
router.post('/login', loginUser);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateUserProfile);

router.get('/all-users', async (req, res) => {
    try {
        const User = require('../models/User');
        const users = await User.find().select('-password');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;