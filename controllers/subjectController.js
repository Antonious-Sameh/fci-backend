const Subject = require('../models/Subject');

// ─────────────────────────────────────────────────────────────────
// @desc    جلب كل مواد سنة + ترم معين
// @route   GET /api/subjects?year=1&term=1
// @access  Private (student)
// ─────────────────────────────────────────────────────────────────
const getSubjects = async (req, res) => {
  try {
    const { year, term } = req.query;

    if (!year || !term) {
      return res
        .status(400)
        .json({ success: false, message: 'year و term مطلوبين' });
    }

    const subjects = await Subject.find({
      year: Number(year),
      term: Number(term),
      isActive: true,
    })
      .select('-lectures') // بدون المحاضرات في القائمة
      .sort({ order: 1, createdAt: 1 });

    res.json({ success: true, count: subjects.length, subjects });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'خطأ في السيرفر' });
  }
};

// ─────────────────────────────────────────────────────────────────
// @desc    جلب مادة واحدة بالـ slug + محاضراتها
// @route   GET /api/subjects/:slug
// @access  Private (student)
// ─────────────────────────────────────────────────────────────────
const getSubject = async (req, res) => {
  try {
    const subject = await Subject.findOne({
      slug: req.params.slug,
      isActive: true,
    });

    if (!subject) {
      return res
        .status(404)
        .json({ success: false, message: 'المادة غير موجودة' });
    }

    // رتب المحاضرات حسب الـ order
    subject.lectures.sort((a, b) => a.order - b.order);

    res.json({ success: true, subject });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'خطأ في السيرفر' });
  }
};

// ─────────────────────────────────────────────────────────────────
// @desc    إضافة مادة جديدة
// @route   POST /api/subjects
// @access  Admin only
// ─────────────────────────────────────────────────────────────────
const createSubject = async (req, res) => {
  try {
    const { slug, nameAr, nameEn, descAr, descEn, year, term, instructor, code, creditHours, order } =
      req.body;

    if (!slug || !nameAr || !year || !term) {
      return res
        .status(400)
        .json({ success: false, message: 'slug, nameAr, year, term مطلوبين' });
    }

    // تحقق من عدم تكرار الـ slug
    const exists = await Subject.findOne({ slug });
    if (exists) {
      return res
        .status(400)
        .json({ success: false, message: 'slug مكرر — اختر اسم مختلف' });
    }

    const subject = await Subject.create({
      slug,
      name: { ar: nameAr, en: nameEn || '' },
      description: { ar: descAr || '', en: descEn || '' },
      year: Number(year),
      term: Number(term),
      instructor: instructor || '',
      code: code || '',
      creditHours: creditHours || 3,
      order: order || 0,
    });

    res.status(201).json({ success: true, subject });
  } catch (error) {
    console.error(error);
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ success: false, message: messages.join(', ') });
    }
    res.status(500).json({ success: false, message: 'خطأ في السيرفر' });
  }
};

// ─────────────────────────────────────────────────────────────────
// @desc    تعديل مادة
// @route   PUT /api/subjects/:id
// @access  Admin only
// ─────────────────────────────────────────────────────────────────
const updateSubject = async (req, res) => {
  try {
    const subject = await Subject.findById(req.params.id);
    if (!subject) {
      return res
        .status(404)
        .json({ success: false, message: 'المادة غير موجودة' });
    }

    const { nameAr, nameEn, descAr, descEn, instructor, code, creditHours, order, isActive } =
      req.body;

    if (nameAr) subject.name.ar = nameAr;
    if (nameEn !== undefined) subject.name.en = nameEn;
    if (descAr !== undefined) subject.description.ar = descAr;
    if (descEn !== undefined) subject.description.en = descEn;
    if (instructor !== undefined) subject.instructor = instructor;
    if (code !== undefined) subject.code = code;
    if (creditHours !== undefined) subject.creditHours = creditHours;
    if (order !== undefined) subject.order = order;
    if (isActive !== undefined) subject.isActive = isActive;

    await subject.save();
    res.json({ success: true, subject });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'خطأ في السيرفر' });
  }
};

// ─────────────────────────────────────────────────────────────────
// @desc    حذف مادة
// @route   DELETE /api/subjects/:id
// @access  Admin only
// ─────────────────────────────────────────────────────────────────
const deleteSubject = async (req, res) => {
  try {
    const subject = await Subject.findById(req.params.id);
    if (!subject) {
      return res
        .status(404)
        .json({ success: false, message: 'المادة غير موجودة' });
    }

    await subject.deleteOne();
    res.json({ success: true, message: 'تم حذف المادة' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'خطأ في السيرفر' });
  }
};

// ══════════════════════════════════════════════════════════════════
//  LECTURES — إضافة / تعديل / حذف محاضرة داخل مادة
// ══════════════════════════════════════════════════════════════════

// ─────────────────────────────────────────────────────────────────
// @desc    إضافة محاضرة أو سكشن لمادة
// @route   POST /api/subjects/:id/lectures
// @access  Admin only
// ─────────────────────────────────────────────────────────────────
const addLecture = async (req, res) => {
  try {
    const subject = await Subject.findById(req.params.id);
    if (!subject) {
      return res
        .status(404)
        .json({ success: false, message: 'المادة غير موجودة' });
    }

    const { titleAr, titleEn, type, videoUrl, videoId, duration, order } = req.body;

    if (!titleAr) {
      return res
        .status(400)
        .json({ success: false, message: 'عنوان المحاضرة بالعربي مطلوب' });
    }

    const lecture = {
      title: { ar: titleAr, en: titleEn || '' },
      type: type || 'lecture',
      videoUrl: videoUrl || '',
      videoId: videoId || '',
      duration: duration || '',
      order: order !== undefined ? order : subject.lectures.length,
    };

    // لو فيه PDF اتحمل
    if (req.file) {
      lecture.pdfUrl = req.file.path || req.file.secure_url || '';
      lecture.pdfPublicId = req.file.filename || req.file.public_id || '';
      lecture.pdfName = req.file.originalname || '';
    }

    subject.lectures.push(lecture);
    await subject.save();

    const newLecture = subject.lectures[subject.lectures.length - 1];
    res.status(201).json({ success: true, lecture: newLecture });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'خطأ في السيرفر' });
  }
};

// ─────────────────────────────────────────────────────────────────
// @desc    تعديل محاضرة
// @route   PUT /api/subjects/:id/lectures/:lectureId
// @access  Admin only
// ─────────────────────────────────────────────────────────────────
const updateLecture = async (req, res) => {
  try {
    const subject = await Subject.findById(req.params.id);
    if (!subject) {
      return res.status(404).json({ success: false, message: 'المادة غير موجودة' });
    }

    const lecture = subject.lectures.id(req.params.lectureId);
    if (!lecture) {
      return res.status(404).json({ success: false, message: 'المحاضرة غير موجودة' });
    }

    const { titleAr, titleEn, type, videoUrl, videoId, duration, order, isVisible } = req.body;

    if (titleAr) lecture.title.ar = titleAr;
    if (titleEn !== undefined) lecture.title.en = titleEn;
    if (type) lecture.type = type;
    if (videoUrl !== undefined) lecture.videoUrl = videoUrl;
    if (videoId !== undefined) lecture.videoId = videoId;
    if (duration !== undefined) lecture.duration = duration;
    if (order !== undefined) lecture.order = order;
    if (isVisible !== undefined) lecture.isVisible = isVisible;

    if (req.file) {
      lecture.pdfUrl = req.file.path || req.file.secure_url || '';
      lecture.pdfPublicId = req.file.filename || req.file.public_id || '';
      lecture.pdfName = req.file.originalname || '';
    }

    await subject.save();
    res.json({ success: true, lecture });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'خطأ في السيرفر' });
  }
};

// ─────────────────────────────────────────────────────────────────
// @desc    حذف محاضرة
// @route   DELETE /api/subjects/:id/lectures/:lectureId
// @access  Admin only
// ─────────────────────────────────────────────────────────────────
const deleteLecture = async (req, res) => {
  try {
    const subject = await Subject.findById(req.params.id);
    if (!subject) {
      return res.status(404).json({ success: false, message: 'المادة غير موجودة' });
    }

    const lecture = subject.lectures.id(req.params.lectureId);
    if (!lecture) {
      return res.status(404).json({ success: false, message: 'المحاضرة غير موجودة' });
    }

    // لو فيه PDF على Cloudinary، احذفه
    if (lecture.pdfPublicId) {
      try {
        const upload = require('../config/upload');
        if (upload.cloudinary) await upload.cloudinary.uploader.destroy(lecture.pdfPublicId, { resource_type: 'raw' });
      } catch (e) {
        console.warn('Could not delete PDF from Cloudinary:', e.message);
      }
    }

    lecture.deleteOne();
    await subject.save();
    res.json({ success: true, message: 'تم حذف المحاضرة' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'خطأ في السيرفر' });
  }
};

module.exports = {
  getSubjects,
  getSubject,
  createSubject,
  updateSubject,
  deleteSubject,
  addLecture,
  updateLecture,
  deleteLecture,
};