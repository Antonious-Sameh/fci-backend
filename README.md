# 🎓 FCI Backend — دليل التشغيل

## هيكل المجلدات

```
fci-backend/
├── config/
│   └── db.js              ← الاتصال بـ MongoDB
├── controllers/
│   └── authController.js  ← منطق التسجيل والدخول
├── middleware/
│   └── auth.js            ← التحقق من JWT
├── models/
│   └── User.js            ← نموذج المستخدم
├── routes/
│   └── auth.js            ← مسارات الـ Auth
├── uploads/               ← ملفات مرفوعة (PDFs)
├── .env.example           ← نموذج متغيرات البيئة
├── .gitignore
├── package.json
└── server.js              ← نقطة البداية
```

## خطوات التشغيل

### 1. تثبيت المكتبات
```bash
cd fci-backend
npm install
```

### 2. إعداد ملف .env
```bash
cp .env.example .env
# افتح .env وحط القيم الحقيقية
```

### 3. تشغيل MongoDB
- **Local**: تأكد إن MongoDB شغال على جهازك
  ```bash
  mongod  # أو عبر MongoDB Compass
  ```
- **Atlas**: حط الـ connection string في MONGO_URI

### 4. تشغيل السيرفر
```bash
npm run dev   # development (nodemon)
npm start     # production
```

السيرفر هيشتغل على: `http://localhost:5000`

## الـ API Endpoints المتاحة

| Method | URL | وصف | Auth |
|--------|-----|-----|------|
| POST | /api/auth/register | تسجيل طالب جديد | Public |
| POST | /api/auth/login | تسجيل دخول | Public |
| GET | /api/auth/me | بيانات المستخدم الحالي | Private |
| PUT | /api/auth/change-password | تغيير الباسورد | Private |
| GET | /api/health | التحقق من عمل السيرفر | Public |

## تحديث الفرونت

1. انسخ `AuthContext.jsx` واستبدل الموجود في `fci-main/src/context/`
2. أضف ملف `.env` للفرونت:
   ```
   VITE_API_URL=http://localhost:5000/api
   ```
3. في `RegisterPage.jsx` — غير استدعاء register ليمرر `(name, email, password, year)`

## المرحلة القادمة
- [ ] نماذج المحتوى الدراسي (Subject, Lecture, Year)
- [ ] Admin APIs
- [ ] رفع PDFs بـ Multer
