const express = require('express');
const router = express.Router();
const {
  register, login, getMe, changePassword,
  updateProfile, saveCareerProgress, getCareerProgress
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');

// Public
router.post('/register', register);
router.post('/login', login);

// Private (محتاج token)
router.get('/me', protect, getMe);
router.put('/change-password', protect, changePassword);
router.put('/profile', protect, updateProfile);

// Career Progress
router.put('/career-progress', protect, saveCareerProgress);
router.get('/career-progress/:slug', protect, getCareerProgress);

module.exports = router;