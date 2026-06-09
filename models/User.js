const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'الاسم مطلوب'],
      trim: true,
      maxlength: [100, 'الاسم لا يتجاوز 100 حرف'],
    },
    email: {
      type: String,
      required: [true, 'الإيميل مطلوب'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'إيميل غير صحيح'],
    },
    password: {
      type: String,
      required: [true, 'كلمة المرور مطلوبة'],
      minlength: [6, 'كلمة المرور لا تقل عن 6 أحرف'],
      select: false, // لا يُرجع الباسورد في الـ queries تلقائياً
    },
    role: {
      type: String,
      enum: ['student', 'admin'],
      default: 'student',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    // معلومات إضافية للطالب
    studentId: {
      type: String,
      trim: true,
    },
    year: {
      type: Number,
      min: 1,
      max: 4,
    },
    profileImage: {
      type: String,
      default: '',
    },
    // الكورسات اللي اشترك فيها
    enrolledCourses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
      },
    ],
    lastLogin: {
      type: Date,
    },
    // تقدم الطالب في المسارات المهنية
    // كل مسار له: checkedItems (المهارات المكتملة) + selectedChoices (الـ framework المختار)
    careerProgress: [
      {
        careerSlug: { type: String, required: true },
        // مثال: ["0-0", "0-1", "1-2"] — levelIndex-itemIndex
        checkedItems: [{ type: String }],
        // مثال: { "1": 0 } — levelIndex: choiceIndex
        selectedChoices: { type: Map, of: Number, default: {} },
        updatedAt: { type: Date, default: Date.now },
      },
    ],
  },
  {
    timestamps: true, // createdAt و updatedAt تلقائي
  }
);

// قبل الحفظ: hash الباسورد لو اتغير
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// method للتحقق من الباسورد
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);