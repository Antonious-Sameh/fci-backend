const Department = require('../models/Department');

// GET /api/departments
const getDepartments = async (req, res) => {
  try {
    const departments = await Department.find({ isActive: true }).sort({ order: 1 });
    res.json({ success: true, departments });
  } catch (error) {
    res.status(500).json({ success: false, message: 'خطأ في السيرفر' });
  }
};

// GET /api/departments/:slug
const getDepartment = async (req, res) => {
  try {
    const department = await Department.findOne({ slug: req.params.slug, isActive: true });
    if (!department)
      return res.status(404).json({ success: false, message: 'القسم غير موجود' });
    res.json({ success: true, department });
  } catch (error) {
    res.status(500).json({ success: false, message: 'خطأ في السيرفر' });
  }
};

// POST /api/departments  (admin)
const createDepartment = async (req, res) => {
  try {
    const dept = await Department.create(req.body);
    res.status(201).json({ success: true, department: dept });
  } catch (error) {
    if (error.code === 11000)
      return res.status(400).json({ success: false, message: 'slug مكرر' });
    res.status(500).json({ success: false, message: 'خطأ في السيرفر' });
  }
};

// PUT /api/departments/:id  (admin)
const updateDepartment = async (req, res) => {
  try {
    const dept = await Department.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!dept)
      return res.status(404).json({ success: false, message: 'القسم غير موجود' });
    res.json({ success: true, department: dept });
  } catch (error) {
    res.status(500).json({ success: false, message: 'خطأ في السيرفر' });
  }
};

// DELETE /api/departments/:id  (admin)
const deleteDepartment = async (req, res) => {
  try {
    const dept = await Department.findByIdAndDelete(req.params.id);
    if (!dept)
      return res.status(404).json({ success: false, message: 'القسم غير موجود' });
    res.json({ success: true, message: 'تم الحذف' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'خطأ في السيرفر' });
  }
};

module.exports = { getDepartments, getDepartment, createDepartment, updateDepartment, deleteDepartment };
