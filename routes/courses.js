const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/auth');
const {
  getCourses, getCourse, enrollCourse, getMyCourses,
  createCourse, updateCourse, deleteCourse, addVideo, deleteVideo,
} = require('../controllers/courseController');

// Public (but requires auth)
router.get('/', protect, getCourses);
router.get('/my', protect, getMyCourses);
router.get('/:id', protect, getCourse);
router.post('/:id/enroll', protect, enrollCourse);

// Admin
router.post('/', protect, adminOnly, createCourse);
router.put('/:id', protect, adminOnly, updateCourse);
router.delete('/:id', protect, adminOnly, deleteCourse);

// Videos
router.post('/:id/videos', protect, adminOnly, addVideo);
router.delete('/:id/videos/:videoId', protect, adminOnly, deleteVideo);

module.exports = router;