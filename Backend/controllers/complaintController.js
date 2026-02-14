const asyncHandler = require('express-async-handler');
const Complaint = require('../models/Complaint');
const User = require('../models/User');

// @desc    Get all complaints
// @route   GET /api/complaints
// @access  Public
const getComplaints = asyncHandler(async (req, res) => {
    const complaints = await Complaint.find();
    res.status(200).json(complaints);
});

// @desc    Get user complaints
// @route   GET /api/complaints/my
// @access  Private
const getMyComplaints = asyncHandler(async (req, res) => {
    // Assuming user ID is available in req.user after authentication middleware
    const complaints = await Complaint.find({ user: req.user.id });
    res.status(200).json(complaints);
});

// @desc    Beast mode set complaint
// @route   POST /api/complaints
// @access  Private
const createComplaint = asyncHandler(async (req, res) => {
    if (!req.body.title || !req.body.description) {
        res.status(400);
        throw new Error('Please add title and description');
    }

    const complaint = await Complaint.create({
        title: req.body.title,
        issueType: req.body.issueType,
        priority: req.body.priority,
        address: req.body.address,
        landmark: req.body.landmark,
        description: req.body.description,
        location: req.body.location,
        user: req.user.id,
    });

    res.status(200).json(complaint);
});

// @desc    Update complaint
// @route   PUT /api/complaints/:id
// @access  Private
const updateComplaint = asyncHandler(async (req, res) => {
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
        res.status(400);
        throw new Error('Complaint not found');
    }

    // Check for user
    if (!req.user) {
        res.status(401);
        throw new Error('User not found');
    }

    // Make sure the logged in user matches the complaint user
    if (complaint.user.toString() !== req.user.id) {
        res.status(401);
        throw new Error('User not authorized');
    }

    const updatedComplaint = await Complaint.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
    });

    res.status(200).json(updatedComplaint);
});

// @desc    Get complaint stats
// @route   GET /api/complaints/stats
// @access  Private
const getComplaintStats = asyncHandler(async (req, res) => {
    const totalIssues = await Complaint.countDocuments({ user: req.user.id });
    const pending = await Complaint.countDocuments({ user: req.user.id, status: 'pending' });
    const inProgress = await Complaint.countDocuments({ user: req.user.id, status: 'in_progress' });
    const resolved = await Complaint.countDocuments({ user: req.user.id, status: 'resolved' });

    res.status(200).json({
        totalIssues,
        pending,
        inProgress,
        resolved
    });
});

// @desc    Vote on a complaint
// @route   PUT /api/complaints/:id/vote
// @access  Private
const voteComplaint = asyncHandler(async (req, res) => {
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
        res.status(404);
        throw new Error('Complaint not found');
    }

    const { voteType } = req.body; // 'upvote' or 'downvote'
    const userId = req.user.id;

    if (voteType === 'upvote') {
        // Remove from downvotes if present
        if (complaint.downvotes.includes(userId)) {
            complaint.downvotes.pull(userId);
        }
        // Toggle upvote
        if (complaint.upvotes.includes(userId)) {
            complaint.upvotes.pull(userId);
        } else {
            complaint.upvotes.push(userId);
        }
    } else if (voteType === 'downvote') {
        // Remove from upvotes if present
        if (complaint.upvotes.includes(userId)) {
            complaint.upvotes.pull(userId);
        }
        // Toggle downvote
        if (complaint.downvotes.includes(userId)) {
            complaint.downvotes.pull(userId);
        } else {
            complaint.downvotes.push(userId);
        }
    } else {
        res.status(400);
        throw new Error('Invalid vote type');
    }

    await complaint.save();
    res.status(200).json(complaint);
});

// @desc    Add a comment to a complaint
// @route   POST /api/complaints/:id/comment
// @access  Private
const addComment = asyncHandler(async (req, res) => {
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
        res.status(404);
        throw new Error('Complaint not found');
    }

    const { text } = req.body;

    if (!text) {
        res.status(400);
        throw new Error('Please add a comment');
    }

    const comment = {
        user: req.user.id,
        text,
        createdAt: Date.now()
    };

    complaint.comments.push(comment);

    await complaint.save();

    // Populate user details for the new comment to return it immediately
    // Or just return the complaint and let frontend handle it. 
    // Ideally we want to return the complaint with populated comments but for now just returning complaint.
    // Re-fetching to populate comments users if needed, 
    // but simple push and save is enough for now.

    res.status(200).json(complaint);
});

module.exports = {
    getComplaints,
    createComplaint,
    updateComplaint,
    getMyComplaints,
    getComplaintStats,
    voteComplaint,
    addComment
};
