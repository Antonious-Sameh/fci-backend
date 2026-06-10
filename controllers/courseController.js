const Course = require('../models/Course');
const User = require('../models/User');

// ── helper ────────────────────────────────────────────────────────
const extractYoutubeId = (url) => {
  if (!url) return '';
  const m = url.match(/(?:v=|youtu\.be\/|embed\/)([^&\n?#]+)/);
  return m?.[1] || '';
};

const sanitizeCoursePayload = (body) => {
  const {
    title, description, instructor, platform, category,
    level, language, price, thumbnail, thumbnailUrl,
    courseUrl, url, tags, isActive, order, duration,
  } = body;
  const finalUrl = courseUrl || url || '';
  return {
    title, description, instructor, platform, category,
    level, language,
    price: price !== undefined ? Number(price) : undefined,
    thumbnail: thumbnail || thumbnailUrl,
    courseUrl: finalUrl,
    url: finalUrl,
    tags, isActive,
    order: order !== undefined ? Number(order) : undefined,
    duration,
  };
};

// ── Student endpoints ─────────────────────────────────────────────
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
      ];
    }
    const courses = await Course.find(filter)
      .select('-enrolledUsers')
      .sort({ order: 1, createdAt: -1 });
    res.json({ success: true, count: courses.length, courses });
  } catch {
    res.status(500).json({ success: false, message: 'خطأ في السيرفر' });
  }
};

const getCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ success: false, message: 'الكورس غير موجود' });
    const isEnrolled = course.enrolledUsers.includes(req.user._id);
    // ترتيب الفيديوهات
    const sortedCourse = course.toObject();
    sortedCourse.videos = [...(sortedCourse.videos || [])].sort((a, b) => (a.order || 0) - (b.order || 0));
    res.json({ success: true, course: sortedCourse, isEnrolled });
  } catch {
    res.status(500).json({ success: false, message: 'خطأ في السيرفر' });
  }
};

const enrollCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ success: false, message: 'الكورس غير موجود' });
    if (course.enrolledUsers.includes(req.user._id))
      return res.status(400).json({ success: false, message: 'مشترك بالفعل' });
    course.enrolledUsers.push(req.user._id);
    await course.save();
    await User.findByIdAndUpdate(req.user._id, { $addToSet: { enrolledCourses: course._id } });
    res.json({ success: true, message: 'تم الاشتراك في الكورس' });
  } catch {
    res.status(500).json({ success: false, message: 'خطأ في السيرفر' });
  }
};

const getMyCourses = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate({
      path: 'enrolledCourses',
      match: { isActive: true },
      select: '-enrolledUsers',
    });
    res.json({ success: true, courses: user.enrolledCourses });
  } catch {
    res.status(500).json({ success: false, message: 'خطأ في السيرفر' });
  }
};

// ── Admin CRUD ────────────────────────────────────────────────────
const createCourse = async (req, res) => {
  try {
    const data = sanitizeCoursePayload(req.body);
    const course = await Course.create(data);
    res.status(201).json({ success: true, course });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ success: false, message: messages.join(', ') });
    }
    res.status(500).json({ success: false, message: 'خطأ في السيرفر' });
  }
};

const updateCourse = async (req, res) => {
  try {
    const data = sanitizeCoursePayload(req.body);
    const course = await Course.findByIdAndUpdate(req.params.id, data, { new: true, runValidators: true });
    if (!course) return res.status(404).json({ success: false, message: 'الكورس غير موجود' });
    res.json({ success: true, course });
  } catch {
    res.status(500).json({ success: false, message: 'خطأ في السيرفر' });
  }
};

const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);
    if (!course) return res.status(404).json({ success: false, message: 'الكورس غير موجود' });
    res.json({ success: true, message: 'تم الحذف' });
  } catch {
    res.status(500).json({ success: false, message: 'خطأ في السيرفر' });
  }
};

// ── Video Management ──────────────────────────────────────────────
// POST /api/courses/:id/videos
const addVideo = async (req, res) => {
  try {
    const { title, description, youtubeUrl, duration, order } = req.body;
    if (!title?.trim()) return res.status(400).json({ success: false, message: 'عنوان الفيديو مطلوب' });
    if (!youtubeUrl?.trim()) return res.status(400).json({ success: false, message: 'رابط اليوتيوب مطلوب' });

    const youtubeId = extractYoutubeId(youtubeUrl);
    if (!youtubeId) return res.status(400).json({ success: false, message: 'رابط يوتيوب غير صالح' });

    const course = await Course.findByIdAndUpdate(
      req.params.id,
      {
        $push: {
          videos: {
            title: title.trim(),
            description: description?.trim() || '',
            youtubeUrl: youtubeUrl.trim(),
            youtubeId,
            duration: duration?.trim() || '',
            order: Number(order) || 0,
          },
        },
      },
      { new: true }
    );
    if (!course) return res.status(404).json({ success: false, message: 'الكورس غير موجود' });

    const sorted = [...course.videos].sort((a, b) => (a.order || 0) - (b.order || 0));
    res.json({ success: true, videos: sorted });
  } catch (error) {
    console.error('addVideo error:', error);
    res.status(500).json({ success: false, message: 'خطأ في السيرفر' });
  }
};

// PUT /api/courses/:id/videos/:videoId
const updateVideo = async (req, res) => {
  try {
    const { title, description, youtubeUrl, duration, order } = req.body;
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ success: false, message: 'الكورس غير موجود' });

    const video = course.videos.id(req.params.videoId);
    if (!video) return res.status(404).json({ success: false, message: 'الفيديو غير موجود' });

    if (title !== undefined) video.title = title.trim();
    if (description !== undefined) video.description = description.trim();
    if (youtubeUrl !== undefined) {
      const youtubeId = extractYoutubeId(youtubeUrl);
      if (!youtubeId) return res.status(400).json({ success: false, message: 'رابط يوتيوب غير صالح' });
      video.youtubeUrl = youtubeUrl.trim();
      video.youtubeId = youtubeId;
    }
    if (duration !== undefined) video.duration = duration.trim();
    if (order !== undefined) video.order = Number(order);

    await course.save();
    const sorted = [...course.videos].sort((a, b) => (a.order || 0) - (b.order || 0));
    res.json({ success: true, videos: sorted });
  } catch (error) {
    res.status(500).json({ success: false, message: 'خطأ في السيرفر' });
  }
};

// DELETE /api/courses/:id/videos/:videoId
const deleteVideo = async (req, res) => {
  try {
    const course = await Course.findByIdAndUpdate(
      req.params.id,
      { $pull: { videos: { _id: req.params.videoId } } },
      { new: true }
    );
    if (!course) return res.status(404).json({ success: false, message: 'الكورس غير موجود' });
    const sorted = [...course.videos].sort((a, b) => (a.order || 0) - (b.order || 0));
    res.json({ success: true, videos: sorted });
  } catch {
    res.status(500).json({ success: false, message: 'خطأ في السيرفر' });
  }
};

module.exports = {
  getCourses, getCourse, enrollCourse, getMyCourses,
  createCourse, updateCourse, deleteCourse,
  addVideo, updateVideo, deleteVideo,
};