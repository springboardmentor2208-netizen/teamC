const express = require('express');
const router = express.Router();
const { getUsers, deleteUser, getAdminStats, getAdminLogs } = require('../controllers/adminController');
const { protect, admin } = require('../middleware/authMiddleware');

router.use(protect);
router.use(admin);

router.route('/users').get(getUsers);
router.route('/users/:id').delete(deleteUser);
router.route('/stats').get(getAdminStats);
router.route('/logs').get(getAdminLogs);

module.exports = router;
