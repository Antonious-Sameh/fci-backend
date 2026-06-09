const express = require('express');
const router = express.Router();
const { getCourses, getCourse, enrollCourse, getMyCourses, createCourse, updateCourse, deleteCourse } = require('../controllers/courseController');
const { protect, adminOnly } = require('../middleware/auth');

router.get('/my', protect, getMyCourses);       // لازم يجي قبل /:id
router.get('/', protect, getCourses);
router.get('/:id', protect, getCourse);
router.post('/:id/enroll', protect, enrollCourse);
router.post('/', protect, adminOnly, createCourse);
router.put('/:id', protect, adminOnly, updateCourse);
router.delete('/:id', protect, adminOnly, deleteCourse);

module.exports = router;
