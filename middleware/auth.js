const jwt = require('jsonwebtoken');
const User = require('../models/User');

// ✅ التحقق من الـ token
const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ message: 'غير مصرح — يرجى تسجيل الدخول' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');

    if (!req.user) {
      return res.status(401).json({ message: 'المستخدم غير موجود' });
    }

    if (!req.user.isActive) {
      return res.status(403).json({ message: 'الحساب موقوف — تواصل مع الإدارة' });
    }

    next();
  } catch (error) {
    return res.status(401).json({ message: 'token غير صالح أو منتهي الصلاحية' });
  }
};

// ✅ التحقق من صلاحية Admin
const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    return next();
  }
  return res.status(403).json({ message: 'هذه الصفحة للمسؤولين فقط' });
};

module.exports = { protect, adminOnly };
