const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getMe, updateUserProfile } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
// potentially need middleware for protection, skipping for now for basic login/register

router.post('/', registerUser);
router.post('/login', loginUser);
router.put('/profile', protect, updateUserProfile);
router.get('/me', protect, getMe);

// Development endpoint to view all users
router.get('/all-users', async (req, res) => {
    try {
        const User = require('../models/User');
        const users = await User.find().select('-password'); // Exclude password field
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
