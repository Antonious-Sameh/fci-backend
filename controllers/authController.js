const jwt = require('jsonwebtoken');
const User = require('../models/User');

// ─── helper: توليد JWT ───────────────────────────────────────────
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d',
  });
};

// ─── helper: شكل response موحد ──────────────────────────────────
const sendTokenResponse = (user, statusCode, res) => {
  const token = generateToken(user._id);
  res.status(statusCode).json({
    success: true,
    token,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
      profileImage: user.profileImage,
      year: user.year,
      studentId: user.studentId,
    },
  });
};

// @desc    تسجيل طالب جديد
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res) => {
  try {
    const { name, email, password, year, studentId } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'الاسم والإيميل وكلمة المرور مطلوبين' });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'هذا الإيميل مسجل بالفعل' });
    }

    const user = await User.create({
      name,
      email,
      password,
      role: 'student',
      year: year || null,
      studentId: studentId || null,
    });

    sendTokenResponse(user, 201, res);
  } catch (error) {
    console.error('Register error:', error);
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ success: false, message: messages.join(', ') });
    }
    res.status(500).json({ success: false, message: 'خطأ في السيرفر' });
  }
};

// @desc    تسجيل دخول
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'الإيميل وكلمة المرور مطلوبين' });
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

    if (!user) {
      return res.status(401).json({ success: false, message: 'إيميل أو كلمة مرور غلط' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'إيميل أو كلمة مرور غلط' });
    }

    if (!user.isActive) {
      return res.status(403).json({ success: false, message: 'حسابك موقوف — تواصل مع الإدارة' });
    }

    user.lastLogin = new Date();
    await user.save({ validateBeforeSave: false });

    sendTokenResponse(user, 200, res);
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'خطأ في السيرفر' });
  }
};

// @desc    بيانات المستخدم الحالي
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.status(200).json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
        profileImage: user.profileImage,
        year: user.year,
        studentId: user.studentId,
        enrolledCourses: user.enrolledCourses,
        createdAt: user.createdAt,
        lastLogin: user.lastLogin,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'خطأ في السيرفر' });
  }
};

// @desc    تغيير كلمة المرور
// @route   PUT /api/auth/change-password
// @access  Private
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, message: 'كلمة المرور الحالية والجديدة مطلوبتين' });
    }

    const user = await User.findById(req.user._id).select('+password');
    const isMatch = await user.matchPassword(currentPassword);

    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'كلمة المرور الحالية غلط' });
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({ success: true, message: 'تم تغيير كلمة المرور' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'خطأ في السيرفر' });
  }
};

// @desc    تحديث بيانات المستخدم
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = async (req, res) => {
  try {
    const { name, year, studentId } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) return res.status(404).json({ success: false, message: 'المستخدم غير موجود' });

    if (name) user.name = name;
    if (year !== undefined) user.year = year;
    if (studentId !== undefined) user.studentId = studentId;

    await user.save({ validateBeforeSave: false });

    res.json({
      success: true,
      message: 'تم تحديث البيانات',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        year: user.year,
        studentId: user.studentId,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'خطأ في السيرفر' });
  }
};

// @desc    حفظ تقدم الطالب في مسار معين
// @route   PUT /api/auth/career-progress
// @access  Private
const saveCareerProgress = async (req, res) => {
  try {
    const { careerSlug, checkedItems, selectedChoices } = req.body;

    if (!careerSlug) {
      return res.status(400).json({ success: false, message: 'careerSlug مطلوب' });
    }

    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ success: false, message: 'المستخدم غير موجود' });

    const existingIdx = user.careerProgress.findIndex((p) => p.careerSlug === careerSlug);

    const progressEntry = {
      careerSlug,
      checkedItems: checkedItems || [],
      selectedChoices: selectedChoices || {},
      updatedAt: new Date(),
    };

    if (existingIdx >= 0) {
      user.careerProgress[existingIdx] = progressEntry;
    } else {
      user.careerProgress.push(progressEntry);
    }

    await user.save({ validateBeforeSave: false });
    res.json({ success: true, message: 'تم حفظ التقدم' });
  } catch (error) {
    console.error('saveCareerProgress error:', error);
    res.status(500).json({ success: false, message: 'خطأ في السيرفر' });
  }
};

// @desc    جلب تقدم الطالب في مسار معين
// @route   GET /api/auth/career-progress/:slug
// @access  Private
const getCareerProgress = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('careerProgress');
    if (!user) return res.status(404).json({ success: false, message: 'المستخدم غير موجود' });

    const progress = user.careerProgress.find((p) => p.careerSlug === req.params.slug);

    res.json({
      success: true,
      progress: progress
        ? {
            careerSlug: progress.careerSlug,
            checkedItems: progress.checkedItems || [],
            selectedChoices: Object.fromEntries(progress.selectedChoices || new Map()),
          }
        : null,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'خطأ في السيرفر' });
  }
};

module.exports = {
  register,
  login,
  getMe,
  changePassword,
  updateProfile,
  saveCareerProgress,
  getCareerProgress,
};