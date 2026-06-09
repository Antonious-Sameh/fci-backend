const express = require('express');
const router = express.Router();
const {
  getSubjects,
  getSubject,
  createSubject,
  updateSubject,
  deleteSubject,
  addLecture,
  updateLecture,
  deleteLecture,
} = require('../controllers/subjectController');
const { protect, adminOnly } = require('../middleware/auth');
const upload = require('../config/upload');

// ── المواد ────────────────────────────────────────────────────────
// GET /api/subjects?year=1&term=1   → قائمة مواد سنة + ترم
// GET /api/subjects/:slug           → تفاصيل مادة + محاضراتها
// POST /api/subjects                → إضافة مادة (admin)
// PUT /api/subjects/:id             → تعديل مادة (admin)
// DELETE /api/subjects/:id          → حذف مادة (admin)

router.get('/', protect, getSubjects);
router.get('/:slug', protect, getSubject);
router.post('/', protect, adminOnly, createSubject);
router.put('/:id', protect, adminOnly, updateSubject);
router.delete('/:id', protect, adminOnly, deleteSubject);

// ── المحاضرات ─────────────────────────────────────────────────────
// POST /api/subjects/:id/lectures               → إضافة محاضرة (admin)
// PUT /api/subjects/:id/lectures/:lectureId     → تعديل محاضرة (admin)
// DELETE /api/subjects/:id/lectures/:lectureId  → حذف محاضرة (admin)

router.post('/:id/lectures', protect, adminOnly, upload.single('pdf'), addLecture);
router.put('/:id/lectures/:lectureId', protect, adminOnly, upload.single('pdf'), updateLecture);
router.delete('/:id/lectures/:lectureId', protect, adminOnly, deleteLecture);

module.exports = router;
