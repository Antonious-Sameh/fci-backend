const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/auth');
const {
  getCourses, getCourse, enrollCourse, getMyCourses,
  createCourse, updateCourse, deleteCourse,
  addVideo, updateVideo, deleteVideo,
} = require('../controllers/courseController');

// ── Static routes أولاً (قبل /:id عشان متتلتقطش غلط) ─────────────
router.get('/my', protect, getMyCourses);

// ── CRUD أساسي ────────────────────────────────────────────────────
router.get('/', protect, getCourses);
router.post('/', protect, adminOnly, createCourse);

router.get('/:id', protect, getCourse);
router.put('/:id', protect, adminOnly, updateCourse);
router.delete('/:id', protect, adminOnly, deleteCourse);

// ── Enroll ────────────────────────────────────────────────────────
router.post('/:id/enroll', protect, enrollCourse);

// ── Videos ── لازم تيجي بعد /:id عشان /:id/videos يتعرف صح ────────
router.get('/:id/videos', protect, (req, res) => {
  // إرجاع فيديوهات الكورس للطالب
  const Course = require('../models/Course');
  Course.findById(req.params.id)
    .select('videos title')
    .then(course => {
      if (!course) return res.status(404).json({ success: false, message: 'الكورس غير موجود' });
      const sorted = [...(course.videos || [])].sort((a, b) => (a.order || 0) - (b.order || 0));
      res.json({ success: true, videos: sorted, courseTitle: course.title });
    })
    .catch(() => res.status(500).json({ success: false, message: 'خطأ في السيرفر' }));
});
router.post('/:id/videos', protect, adminOnly, addVideo);
router.put('/:id/videos/:videoId', protect, adminOnly, updateVideo);
router.delete('/:id/videos/:videoId', protect, adminOnly, deleteVideo);

module.exports = router;