const Career = require('../models/Career');

const getCareers = async (req, res) => {
  try {
    const { difficulty } = req.query;
    const filter = { isActive: true };
    if (difficulty) filter.difficulty = difficulty;
    
    const careers = await Career.find(filter).sort({ order: 1 });
    res.json({ success: true, careers });
  } catch (error) {
    res.status(500).json({ success: false, message: 'خطأ في السيرفر' });
  }
};

const getCareer = async (req, res) => {
  try {
    const career = await Career.findOne({ slug: req.params.slug, isActive: true });
    if (!career)
      return res.status(404).json({ success: false, message: 'المسار غير موجود' });
    res.json({ success: true, career });
  } catch (error) {
    res.status(500).json({ success: false, message: 'خطأ في السيرفر' });
  }
};

const createCareer = async (req, res) => {
  try {
    const { slug, name, description, why, icon, color, levels, order, difficulty } = req.body;
    const career = await Career.create({ slug, name, description, why, icon, color, levels, order, difficulty });
    res.status(201).json({ success: true, career });
  } catch (error) {
    if (error.code === 11000)
      return res.status(400).json({ success: false, message: 'slug مكرر' });
    res.status(500).json({ success: false, message: 'خطأ في السيرفر' });
  }
};

const updateCareer = async (req, res) => {
  try {
    const { slug, name, description, why, icon, color, levels, order, isActive, difficulty } = req.body;
    const career = await Career.findByIdAndUpdate(
      req.params.id,
      { slug, name, description, why, icon, color, levels, order, isActive, difficulty },
      { new: true, runValidators: true }
    );
    if (!career)
      return res.status(404).json({ success: false, message: 'المسار غير موجود' });
    res.json({ success: true, career });
  } catch (error) {
    res.status(500).json({ success: false, message: 'خطأ في السيرفر' });
  }
};

const deleteCareer = async (req, res) => {
  try {
    const career = await Career.findByIdAndDelete(req.params.id);
    if (!career)
      return res.status(404).json({ success: false, message: 'المسار غير موجود' });
    res.json({ success: true, message: 'تم الحذف' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'خطأ في السيرفر' });
  }
};

module.exports = { getCareers, getCareer, createCareer, updateCareer, deleteCareer };