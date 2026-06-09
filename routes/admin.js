const express = require('express');
const router = express.Router();
const {
  getStats,
  getUsers,
  toggleUserActive,
  deleteUser,
  getRecentRegistrations,
  getAllSubjects,
  getAllDepartments,
  getAllCareers,
} = require('../controllers/adminController');
const { protect, adminOnly } = require('../middleware/auth');

// كل الـ admin routes محمية
router.use(protect, adminOnly);

router.get('/stats', getStats);
router.get('/users', getUsers);
router.patch('/users/:id/toggle-active', toggleUserActive);
router.delete('/users/:id', deleteUser);
router.get('/recent-registrations', getRecentRegistrations);
router.get('/subjects', getAllSubjects);
router.get('/departments', getAllDepartments);
router.get('/careers', getAllCareers);

module.exports = router;