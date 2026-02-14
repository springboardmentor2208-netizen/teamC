const express = require('express');
const router = express.Router();
const {
    getComplaints,
    createComplaint,
    updateComplaint,
    getMyComplaints,
    getComplaintStats,
    voteComplaint,
    addComment
} = require('../controllers/complaintController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(getComplaints).post(protect, createComplaint);
router.route('/my').get(protect, getMyComplaints);
router.route('/stats').get(protect, getComplaintStats);
router.route('/:id').put(protect, updateComplaint);
router.route('/:id/vote').put(protect, voteComplaint);
router.route('/:id/comment').post(protect, addComment);
module.exports = router;
