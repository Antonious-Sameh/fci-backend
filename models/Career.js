const mongoose = require('mongoose');

// خطوة داخل level
const stepSchema = new mongoose.Schema({
  name: { type: String, required: true },
  detail: { type: String, default: '' },
  resourceUrl: { type: String, default: '' },
});

// مسار اختياري داخل level
const choiceSchema = new mongoose.Schema({
  path: { type: String, required: true },
  steps: [{ type: String }],
});

// مستوى داخل الـ career
const levelSchema = new mongoose.Schema({
  title: { type: String, required: true },
  isChoice: { type: Boolean, default: false },
  items: [stepSchema],
  choices: [choiceSchema],
  order: { type: Number, default: 0 },
});

// Career / Roadmap
const careerSchema = new mongoose.Schema(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    name: {
      ar: { type: String, required: true },
      en: { type: String, default: '' },
    },
    description: {
      ar: { type: String, default: '' },
      en: { type: String, default: '' },
    },
    why: {
      ar: { type: String, default: '' },
      en: { type: String, default: '' },
    },
    icon: { type: String, default: 'Code' },
    color: { type: String, default: 'blue' },
    levels: [levelSchema],
    difficulty: { type: String, enum: ['beginner', 'intermediate', 'advanced'], default: 'intermediate' },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Career', careerSchema);
