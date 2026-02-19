const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const Complaint = require('../models/Complaint');
const AdminLog = require('../models/AdminLog');

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
const getUsers = asyncHandler(async (req, res) => {
    const users = await User.find({});
    res.json(users);
});

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);

    if (user) {
        await user.deleteOne();

        // Log action
        await AdminLog.create({
            user_id: req.user._id,
            action: `Deleted user: ${user.email} (ID: ${user._id})` // Combined details into action as details field is removed
        });

        res.json({ message: 'User removed' });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

// @desc    Get admin stats
// @route   GET /api/admin/stats
// @access  Private/Admin
const getAdminStats = asyncHandler(async (req, res) => {
    const totalUsers = await User.countDocuments();
    const totalComplaints = await Complaint.countDocuments();
    const resolvedComplaints = await Complaint.countDocuments({ status: 'resolved' });
    const pendingComplaints = await Complaint.countDocuments({ status: 'pending' });

    res.json({
        totalUsers,
        totalComplaints,
        resolvedComplaints,
        pendingComplaints
    });
});

// @desc    Get admin logs
// @route   GET /api/admin/logs
// @access  Private/Admin
const getAdminLogs = asyncHandler(async (req, res) => {
    const logs = await AdminLog.find({}).populate('user_id', 'name email').sort({ createdAt: -1 });
    res.json(logs);
});

module.exports = {
    getUsers,
    deleteUser,
    getAdminStats,
    getAdminLogs
};
