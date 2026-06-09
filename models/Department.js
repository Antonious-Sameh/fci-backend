const mongoose = require('mongoose');

const departmentSchema = new mongoose.Schema(
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
    type: {
      type: String,
      enum: ['general', 'special'],
      default: 'general',
    },
    description: {
      ar: { type: String, default: '' },
      en: { type: String, default: '' },
    },
    pros: {
      ar: { type: String, default: '' },
      en: { type: String, default: '' },
    },
    cons: {
      ar: { type: String, default: '' },
      en: { type: String, default: '' },
    },
    suitableFor: {
      ar: { type: String, default: '' },
      en: { type: String, default: '' },
    },
    icon: { type: String, default: 'BookOpen' },
    color: { type: String, default: 'blue' },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Department', departmentSchema);
