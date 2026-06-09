const mongoose = require('mongoose');

// ── Lecture Schema (Embedded) ──────────────────────────────────────
const lectureSchema = new mongoose.Schema(
  {
    title: {
      ar: { type: String, required: true, trim: true },
      en: { type: String, trim: true, default: '' },
    },
    type: {
      type: String,
      enum: ['lecture', 'section'],
      default: 'lecture',
    },
    order: {
      type: Number,
      default: 0,
    },
    // فيديو يوتيوب
    videoUrl: {
      type: String,
      trim: true,
      default: '',
    },
    videoId: {
      type: String, // YouTube video ID فقط
      trim: true,
      default: '',
    },
    // PDF
    pdfUrl: {
      type: String,
      default: '',
    },
    pdfPublicId: {
      type: String, // Cloudinary public_id للحذف
      default: '',
    },
    pdfName: {
      type: String,
      default: '',
    },
    duration: {
      type: String, // مثال: "45 min"
      default: '',
    },
    isVisible: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// ── Subject Schema ────────────────────────────────────────────────
const subjectSchema = new mongoose.Schema(
  {
    // المعرف النصي (للـ URL) — مثال: math-101
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    name: {
      ar: { type: String, required: true, trim: true },
      en: { type: String, trim: true, default: '' },
    },
    description: {
      ar: { type: String, default: '' },
      en: { type: String, default: '' },
    },
    // السنة الدراسية (1-4)
    year: {
      type: Number,
      required: true,
      min: 1,
      max: 4,
    },
    // الترم (1 أو 2)
    term: {
      type: Number,
      required: true,
      enum: [1, 2],
    },
    // الدكتور المسؤول (اختياري)
    instructor: {
      type: String,
      trim: true,
      default: '',
    },
    // كود المادة — مثال: CS101
    code: {
      type: String,
      trim: true,
      default: '',
    },
    // عدد الساعات
    creditHours: {
      type: Number,
      default: 3,
    },
    // المحاضرات والسكاشن (embedded)
    lectures: [lectureSchema],

    isActive: {
      type: Boolean,
      default: true,
    },
    order: {
      type: Number,
      default: 0, // ترتيب ظهور المادة
    },
  },
  { timestamps: true }
);

// Index للبحث السريع
subjectSchema.index({ year: 1, term: 1 });
subjectSchema.index({ slug: 1 });

module.exports = mongoose.model('Subject', subjectSchema);
