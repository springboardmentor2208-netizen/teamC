const express = require('express');
const router = express.Router();
const {
    getComplaints,
    createComplaint,
    updateComplaint,
    deleteComplaint,
    getMyComplaints,
    getComplaintStats,
    voteComplaint,
    commentComplaint
} = require('../controllers/complaintController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(getComplaints).post(protect, createComplaint);
router.route('/my').get(protect, getMyComplaints);
router.route('/stats').get(protect, getComplaintStats);
router.route('/:id').put(protect, updateComplaint).delete(protect, deleteComplaint);
router.route('/:id/vote').put(protect, voteComplaint);
router.route('/:id/comment').post(protect, commentComplaint);

module.exports = router;
