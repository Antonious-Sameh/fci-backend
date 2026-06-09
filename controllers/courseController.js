const Course = require('../models/Course');
const User = require('../models/User');

// GET /api/courses
const getCourses = async (req, res) => {
  try {
    const { category, platform, level, language, search } = req.query;
    const filter = { isActive: true };

    if (category) filter.category = category;
    if (platform) filter.platform = platform;
    if (level) filter.level = level;
    if (language) filter.language = language;
    if (search) {
      filter.$or = [
        { 'title.ar': { $regex: search, $options: 'i' } },
        { 'title.en': { $regex: search, $options: 'i' } },
        { 'description.ar': { $regex: search, $options: 'i' } },
      ];
    }

    const courses = await Course.find(filter)
      .select('-enrolledUsers')
      .sort({ order: 1, createdAt: -1 });

    res.json({ success: true, count: courses.length, courses });
  } catch (error) {
    res.status(500).json({ success: false, message: 'خطأ في السيرفر' });
  }
};

// GET /api/courses/:id
const getCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ success: false, message: 'الكورس غير موجود' });

    const isEnrolled = course.enrolledUsers.includes(req.user._id);
    res.json({ success: true, course, isEnrolled });
  } catch (error) {
    res.status(500).json({ success: false, message: 'خطأ في السيرفر' });
  }
};

// POST /api/courses/:id/enroll
const enrollCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ success: false, message: 'الكورس غير موجود' });

    if (course.enrolledUsers.includes(req.user._id)) {
      return res.status(400).json({ success: false, message: 'مشترك بالفعل في هذا الكورس' });
    }

    course.enrolledUsers.push(req.user._id);
    await course.save();

    await User.findByIdAndUpdate(req.user._id, {
      $addToSet: { enrolledCourses: course._id },
    });

    res.json({ success: true, message: 'تم الاشتراك في الكورس' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'خطأ في السيرفر' });
  }
};

// GET /api/courses/my
const getMyCourses = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate({
      path: 'enrolledCourses',
      match: { isActive: true },
      select: '-enrolledUsers',
    });
    res.json({ success: true, courses: user.enrolledCourses });
  } catch (error) {
    res.status(500).json({ success: false, message: 'خطأ في السيرفر' });
  }
};

// POST /api/courses  (admin) — whitelist الحقول المسموح بها فقط
const createCourse = async (req, res) => {
  try {
    const {
      title, description, instructor, platform, category,
      level, language, price, thumbnail, courseUrl,
      tags, isActive, order,
    } = req.body;

    const course = await Course.create({
      title, description, instructor, platform, category,
      level, language, price, thumbnail, courseUrl,
      tags, isActive, order,
    });

    res.status(201).json({ success: true, course });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ success: false, message: messages.join(', ') });
    }
    res.status(500).json({ success: false, message: 'خطأ في السيرفر' });
  }
};

// PUT /api/courses/:id  (admin) — whitelist الحقول المسموح بها فقط
const updateCourse = async (req, res) => {
  try {
    const {
      title, description, instructor, platform, category,
      level, language, price, thumbnail, courseUrl,
      tags, isActive, order,
    } = req.body;

    const course = await Course.findByIdAndUpdate(
      req.params.id,
      { title, description, instructor, platform, category,
        level, language, price, thumbnail, courseUrl,
        tags, isActive, order },
      { new: true, runValidators: true }
    );

    if (!course) return res.status(404).json({ success: false, message: 'الكورس غير موجود' });
    res.json({ success: true, course });
  } catch (error) {
    res.status(500).json({ success: false, message: 'خطأ في السيرفر' });
  }
};

// DELETE /api/courses/:id  (admin)
const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);
    if (!course) return res.status(404).json({ success: false, message: 'الكورس غير موجود' });
    res.json({ success: true, message: 'تم الحذف' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'خطأ في السيرفر' });
  }
};

module.exports = { getCourses, getCourse, enrollCourse, getMyCourses, createCourse, updateCourse, deleteCourse };