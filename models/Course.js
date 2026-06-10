const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema(
  {
    title: {
      ar: { type: String, required: true },
      en: { type: String, default: '' },
    },
    description: {
      ar: { type: String, default: '' },
      en: { type: String, default: '' },
    },
    instructor: { type: String, default: '' },
    platform: {
      type: String,
      enum: ['YouTube', 'Udemy', 'Coursera', 'edX', 'Pluralsight', 'LinkedIn', 'Other'],
      default: 'YouTube',
    },
    courseUrl: { type: String, default: '' },
    url: { type: String, default: '' }, // legacy alias
    price: { type: Number, default: 0 }, // 0 = مجاني
    category: { type: String, default: '' },
    tags: [{ type: String }],
    thumbnailUrl: { type: String, default: '' },
    duration: { type: String, default: '' }, // مثال: "8 hours"
    level: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
      default: 'beginner',
    },
    language: {
      type: String,
      enum: ['ar', 'en', 'both'],
      default: 'ar',
    },
    rating: { type: Number, min: 0, max: 5, default: 0 },
    isActive: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
    // فيديوهات الكورس (للكورسات اللي عندها playlist داخلية)
    videos: [{
      title: { type: String, required: true },
      description: { type: String, default: '' },
      youtubeId: { type: String, default: '' },
      youtubeUrl: { type: String, default: '' },
      duration: { type: String, default: '' },
      order: { type: Number, default: 0 },
    }],
    // الطلاب المسجلين
    enrolledUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  },
  { timestamps: true }
);

courseSchema.index({ category: 1 });
courseSchema.index({ platform: 1 });

module.exports = mongoose.model('Course', courseSchema);
