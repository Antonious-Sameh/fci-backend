const User = require('../models/User');
const Subject = require('../models/Subject');
const Course = require('../models/Course');
const Career = require('../models/Career');
const Department = require('../models/Department');

// @desc    إحصائيات الداشبورد
// @route   GET /api/admin/stats
// @access  Admin only
const getStats = async (req, res) => {
  try {
    const [
      totalStudents,
      activeStudents,
      totalSubjects,
      totalLecturesResult,
      totalCourses,
      newStudentsThisMonth,
    ] = await Promise.all([
      User.countDocuments({ role: 'student' }),
      User.countDocuments({ role: 'student', isActive: true }),
      Subject.countDocuments({ isActive: true }),
      Subject.aggregate([
        { $project: { lectureCount: { $size: '$lectures' } } },
        { $group: { _id: null, total: { $sum: '$lectureCount' } } },
      ]),
      Course.countDocuments({ isActive: true }),
      User.countDocuments({
        role: 'student',
        createdAt: {
          $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        },
      }),
    ]);

    const totalLectures = totalLecturesResult[0]?.total || 0;

    res.json({
      success: true,
      stats: {
        totalStudents,
        activeStudents,
        inactiveStudents: totalStudents - activeStudents,
        totalSubjects,
        totalLectures,
        totalCourses,
        newStudentsThisMonth,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'خطأ في السيرفر' });
  }
};

// @desc    قائمة كل الطلاب
// @route   GET /api/admin/users
// @access  Admin only
const getUsers = async (req, res) => {
  try {
    const { search, isActive, page = 1, limit = 20 } = req.query;

    const filter = { role: 'student' };
    if (isActive !== undefined) filter.isActive = isActive === 'true';
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { studentId: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);
    const [users, total] = await Promise.all([
      User.find(filter)
        .select('-password')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      User.countDocuments(filter),
    ]);

    res.json({
      success: true,
      users,
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'خطأ في السيرفر' });
  }
};

// @desc    تفعيل / تعطيل حساب طالب
// @route   PATCH /api/admin/users/:id/toggle-active
// @access  Admin only
const toggleUserActive = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'المستخدم غير موجود' });
    if (user.role === 'admin') return res.status(403).json({ success: false, message: 'لا يمكن تعطيل حساب Admin' });

    user.isActive = !user.isActive;
    await user.save({ validateBeforeSave: false });

    res.json({
      success: true,
      message: user.isActive ? 'تم تفعيل الحساب' : 'تم تعطيل الحساب',
      isActive: user.isActive,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'خطأ في السيرفر' });
  }
};

// @desc    حذف مستخدم
// @route   DELETE /api/admin/users/:id
// @access  Admin only
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'المستخدم غير موجود' });
    if (user.role === 'admin') return res.status(403).json({ success: false, message: 'لا يمكن حذف Admin' });

    await user.deleteOne();
    res.json({ success: true, message: 'تم حذف المستخدم' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'خطأ في السيرفر' });
  }
};

// @desc    آخر الطلاب المسجلين
// @route   GET /api/admin/recent-registrations
// @access  Admin only
const getRecentRegistrations = async (req, res) => {
  try {
    const limit = Number(req.query.limit) || 10;
    const users = await User.find({ role: 'student' })
      .select('name email year studentId createdAt isActive')
      .sort({ createdAt: -1 })
      .limit(limit);

    res.json({ success: true, users });
  } catch (error) {
    res.status(500).json({ success: false, message: 'خطأ في السيرفر' });
  }
};

// @desc    كل المواد لوحة الأدمن
// @route   GET /api/admin/subjects
// @access  Admin only
const getAllSubjects = async (req, res) => {
  try {
    const subjects = await Subject.find().sort({ year: 1, term: 1, order: 1 });
    const result = subjects.map((s) => ({
      _id: s._id,
      slug: s.slug,
      name: s.name,
      year: s.year,
      term: s.term,
      code: s.code,
      instructor: s.instructor,
      lectureCount: s.lectures.length,
      isActive: s.isActive,
      createdAt: s.createdAt,
    }));
    res.json({ success: true, subjects: result });
  } catch (error) {
    res.status(500).json({ success: false, message: 'خطأ في السيرفر' });
  }
};

// @desc    كل الأقسام للأدمن
// @route   GET /api/admin/departments
// @access  Admin only
const getAllDepartments = async (req, res) => {
  try {
    const departments = await Department.find().sort({ order: 1, createdAt: 1 });
    res.json({ success: true, departments });
  } catch (error) {
    res.status(500).json({ success: false, message: 'خطأ في السيرفر' });
  }
};

// @desc    كل المسارات للأدمن
// @route   GET /api/admin/careers
// @access  Admin only
const getAllCareers = async (req, res) => {
  try {
    const careers = await Career.find().sort({ order: 1, createdAt: 1 });
    res.json({ success: true, careers });
  } catch (error) {
    res.status(500).json({ success: false, message: 'خطأ في السيرفر' });
  }
};

module.exports = {
  getStats,
  getUsers,
  toggleUserActive,
  deleteUser,
  getRecentRegistrations,
  getAllSubjects,
  getAllDepartments,
  getAllCareers,
};