require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Subject = require('./models/Subject');
const Department = require('./models/Department');
const Career = require('./models/Career');
const Course = require('./models/Course');
const connectDB = require('./config/db');

// ══════════════════════════════════════════════════════════════════
// ⚠️  SEED FILE — للاستخدام في بيئة التطوير فقط
//    شغّله مرة واحدة: node seed.js
//    بعد التشغيل البيانات بتروح MongoDB والملف ده بيبقى setup script
//    لا تشغّله في Production أبداً لأنه يحذف كل البيانات الموجودة
// ══════════════════════════════════════════════════════════════════

// بيانات الأدمن — احفظها في .env أو هتستخدم القيم الافتراضية
const ADMIN_EMAIL    = process.env.SEED_ADMIN_EMAIL    || 'Antonious@gmail.com';
const ADMIN_PASSWORD = process.env.SEED_ADMIN_PASSWORD || '123456789';
const STUDENT_EMAIL    = process.env.SEED_STUDENT_EMAIL    || 'student@fci.edu';
const STUDENT_PASSWORD = process.env.SEED_STUDENT_PASSWORD || 'student123';

const seed = async () => {
  await connectDB();
  console.log('🌱 Starting seed...');

  await Promise.all([
    User.deleteMany({}),
    Subject.deleteMany({}),
    Department.deleteMany({}),
    Career.deleteMany({}),
    Course.deleteMany({}),
  ]);
  console.log('🗑️  Cleared old data');

  // ── Users ─────────────────────────────────────────────────────
  await User.create({
    name: 'Admin',
    email: ADMIN_EMAIL,
    password: ADMIN_PASSWORD,
    role: 'admin',
    isActive: true,
  });
  await User.create({
    name: 'Ahmed Mohamed',
    email: STUDENT_EMAIL,
    password: STUDENT_PASSWORD,
    role: 'student',
    year: 1,
    isActive: true,
  });
  console.log('👤 Users created  →  Antonious@gmail.com / 123456789');

  // ── Subjects ──────────────────────────────────────────────────
  await Subject.insertMany([
    // السنة الأولى - الترم الأول
    {
      slug: 'math-101', name: { ar: 'الرياضيات ١', en: 'Mathematics I' },
      description: { ar: 'التفاضل والتكامل وأسس الجبر الخطي', en: 'Calculus and Linear Algebra fundamentals' },
      year: 1, term: 1, code: 'MATH101', creditHours: 3, order: 1,
      lectures: [
        { title: { ar: 'مقدمة في النهايات والاستمرارية', en: 'Limits and Continuity' }, type: 'lecture', videoId: 'WsQQvHm4lSw', duration: '52 دقيقة', order: 1 },
        { title: { ar: 'قواعد الاشتقاق', en: 'Differentiation Rules' }, type: 'lecture', videoId: 'HfACrKJ_Y2w', duration: '45 دقيقة', order: 2 },
        { title: { ar: 'سكشن - تمارين النهايات', en: 'Limits Practice' }, type: 'section', videoId: 'riXcZT2ICjA', duration: '60 دقيقة', order: 3 },
      ],
    },
    {
      slug: 'physics-101', name: { ar: 'فيزياء ١', en: 'Physics I' },
      description: { ar: 'الميكانيكا الكلاسيكية والديناميكا', en: 'Classical Mechanics and Dynamics' },
      year: 1, term: 1, code: 'PHY101', creditHours: 3, order: 2,
      lectures: [
        { title: { ar: 'الحركة في خط مستقيم', en: 'Linear Motion' }, type: 'lecture', videoId: 'ZM8ECpBuQYE', duration: '48 دقيقة', order: 1 },
        { title: { ar: 'قوانين نيوتن', en: "Newton's Laws" }, type: 'lecture', videoId: 'kKKM8Y-u7ds', duration: '55 دقيقة', order: 2 },
      ],
    },
    {
      slug: 'intro-cs', name: { ar: 'مقدمة في علوم الحاسب', en: 'Introduction to Computer Science' },
      description: { ar: 'أساسيات البرمجة بلغة Python والتفكير المنطقي', en: 'Programming basics in Python' },
      year: 1, term: 1, code: 'CS101', creditHours: 3, order: 3,
      lectures: [
        { title: { ar: 'ما هي البرمجة؟ - مقدمة', en: 'What is Programming?' }, type: 'lecture', videoId: '_uQrJ0TkZlc', duration: '60 دقيقة', order: 1 },
        { title: { ar: 'المتغيرات وأنواع البيانات', en: 'Variables and Data Types' }, type: 'lecture', videoId: 'kqtD5dpn9C8', duration: '45 دقيقة', order: 2 },
        { title: { ar: 'الجمل الشرطية والحلقات', en: 'Conditions and Loops' }, type: 'lecture', videoId: 'PqFCg2Or1nk', duration: '50 دقيقة', order: 3 },
        { title: { ar: 'سكشن - حل مسائل Python', en: 'Python Problems' }, type: 'section', videoId: 'rfscVS0vtbw', duration: '90 دقيقة', order: 4 },
      ],
    },
    {
      slug: 'discrete-math', name: { ar: 'الرياضيات المتقطعة', en: 'Discrete Mathematics' },
      description: { ar: 'المنطق والمجموعات والجراف والاحتمالات', en: 'Logic, Sets, Graphs and Probability' },
      year: 1, term: 1, code: 'MATH102', creditHours: 3, order: 4,
    },
    // السنة الأولى - الترم الثاني
    {
      slug: 'math-201', name: { ar: 'الرياضيات ٢', en: 'Mathematics II' },
      description: { ar: 'التكامل والمعادلات التفاضلية', en: 'Integration and Differential Equations' },
      year: 1, term: 2, code: 'MATH201', creditHours: 3, order: 1,
    },
    {
      slug: 'oop-101', name: { ar: 'البرمجة كائنية التوجه', en: 'Object Oriented Programming' },
      description: { ar: 'مفاهيم OOP بلغة Java - الكلاسات والوراثة والـ Polymorphism', en: 'OOP concepts in Java' },
      year: 1, term: 2, code: 'CS102', creditHours: 3, order: 2,
      lectures: [
        { title: { ar: 'مقدمة في OOP والكلاسات', en: 'Intro to OOP and Classes' }, type: 'lecture', videoId: 'xk4_1vDrzzo', duration: '55 دقيقة', order: 1 },
        { title: { ar: 'الوراثة والـ Polymorphism', en: 'Inheritance and Polymorphism' }, type: 'lecture', videoId: 'xk4_1vDrzzo', duration: '60 دقيقة', order: 2 },
      ],
    },
    // السنة الثانية - الترم الأول
    {
      slug: 'data-structures', name: { ar: 'هياكل البيانات', en: 'Data Structures' },
      description: { ar: 'المصفوفات والقوائم المرتبطة والأشجار والـ Graphs', en: 'Arrays, Linked Lists, Trees and Graphs' },
      year: 2, term: 1, code: 'CS201', creditHours: 3, order: 1,
      lectures: [
        { title: { ar: 'المصفوفات والـ Linked Lists', en: 'Arrays and Linked Lists' }, type: 'lecture', videoId: 'RBSGKlAvoiM', duration: '50 دقيقة', order: 1 },
        { title: { ar: 'الـ Stack والـ Queue', en: 'Stack and Queue' }, type: 'lecture', videoId: 'A3ZUpyrnCbM', duration: '45 دقيقة', order: 2 },
        { title: { ar: 'الأشجار الثنائية', en: 'Binary Trees' }, type: 'lecture', videoId: 'oSWTXtMglKE', duration: '55 دقيقة', order: 3 },
        { title: { ar: 'سكشن - تطبيقات عملية', en: 'Practical Applications' }, type: 'section', videoId: 'RBSGKlAvoiM', duration: '90 دقيقة', order: 4 },
      ],
    },
    {
      slug: 'algorithms', name: { ar: 'تحليل الخوارزميات', en: 'Algorithm Analysis' },
      description: { ar: 'تصميم الخوارزميات وتحليل التعقيد الزمني', en: 'Algorithm Design and Complexity Analysis' },
      year: 2, term: 1, code: 'CS202', creditHours: 3, order: 2,
    },
    {
      slug: 'databases', name: { ar: 'قواعد البيانات', en: 'Database Systems' },
      description: { ar: 'نمذجة البيانات وSQL والتصميم العلائقي', en: 'Data Modeling, SQL and Relational Design' },
      year: 2, term: 1, code: 'CS203', creditHours: 3, order: 3,
      lectures: [
        { title: { ar: 'مقدمة في قواعد البيانات والـ ERD', en: 'Intro to Databases and ERD' }, type: 'lecture', videoId: 'ztHopE5Wnpc', duration: '60 دقيقة', order: 1 },
        { title: { ar: 'أساسيات SQL', en: 'SQL Basics' }, type: 'lecture', videoId: 'HXV3zeQKqGY', duration: '75 دقيقة', order: 2 },
      ],
    },
    // السنة الثانية - الترم الثاني
    {
      slug: 'os', name: { ar: 'نظم التشغيل', en: 'Operating Systems' },
      description: { ar: 'العمليات والجدولة وإدارة الذاكرة والملفات', en: 'Processes, Scheduling, Memory and File Management' },
      year: 2, term: 2, code: 'CS204', creditHours: 3, order: 1,
    },
    {
      slug: 'networks', name: { ar: 'شبكات الحاسوب', en: 'Computer Networks' },
      description: { ar: 'نموذج OSI/TCP-IP والبروتوكولات وتقنيات الشبكات', en: 'OSI/TCP-IP Model, Protocols and Network Technologies' },
      year: 2, term: 2, code: 'CS205', creditHours: 3, order: 2,
    },
    // السنة الثالثة - الترم الأول
    {
      slug: 'software-eng', name: { ar: 'هندسة البرمجيات', en: 'Software Engineering' },
      description: { ar: 'دورة حياة تطوير البرمجيات وأنماط التصميم والـ Agile', en: 'SDLC, Design Patterns and Agile' },
      year: 3, term: 1, code: 'CS301', creditHours: 3, order: 1,
    },
    {
      slug: 'web-dev', name: { ar: 'تطوير الويب', en: 'Web Development' },
      description: { ar: 'HTML/CSS/JavaScript وأساسيات بناء تطبيقات الويب', en: 'HTML/CSS/JavaScript and Web App fundamentals' },
      year: 3, term: 1, code: 'CS302', creditHours: 3, order: 2,
    },
    // السنة الرابعة - الترم الأول
    {
      slug: 'grad-project', name: { ar: 'مشروع التخرج', en: 'Graduation Project' },
      description: { ar: 'تطبيق عملي متكامل يجمع كل ما تعلمته', en: 'Comprehensive applied project' },
      year: 4, term: 1, code: 'CS401', creditHours: 6, order: 1,
    },
  ]);
  console.log('📚 Subjects created (14 subjects across 4 years)');

  // ── Departments ───────────────────────────────────────────────
  await Department.insertMany([
    {
      slug: 'cs',
      name: { ar: 'علوم الحاسب', en: 'Computer Science' },
      type: 'general',
      description: {
        ar: 'القسم الأقوى برمجياً في الكلية. بيركز على هندسة البرمجيات، الخوارزميات، وبناء الأنظمة من الصفر. لو بتحب الكود وعاوز تفهم إزاي الحاجات بتشتغل من جوه، ده قسمك.',
        en: 'The most programming-focused department. Focuses on software engineering, algorithms, and building systems from scratch.',
      },
      pros: {
        ar: 'مطلوب جداً في السوق · مرتبات عالية · بيخليك تفهم كل حاجة من جوه · فرص عالمية قوية',
        en: 'Highly in demand · High salaries · Deep technical understanding · Strong global opportunities',
      },
      cons: {
        ar: 'دراسته تقيلة ومحتاجة مجهود عالي · الرياضة فيه كتير · محتاج صبر وتركيز',
        en: 'Heavy workload · Lots of math · Requires patience and focus',
      },
      suitableFor: {
        ar: 'اللي بيحب الكود ومش بيزهق منه · اللي عنده شغف بفهم الأشياء من الداخل · اللي شايف نفسه في شركات تك كبيرة',
        en: 'Those who love coding and want to understand systems deeply',
      },
      icon: 'Code2', color: 'blue', order: 1,
    },
    {
      slug: 'is',
      name: { ar: 'نظم المعلومات', en: 'Information Systems' },
      type: 'general',
      description: {
        ar: 'مزيج ذكي بين البرمجة وإدارة الأعمال. بيعلمك إزاي التكنولوجيا تخدم الشركات وتحل مشاكل بيزنس حقيقية. مناسب لو بتحب تكون في النص بين التقنية والإدارة.',
        en: 'Smart mix of programming and business management. Learn how technology serves businesses.',
      },
      pros: {
        ar: 'مريح نسبياً · بيفتح فرص في Business Analysis والـ ERP · مناسب للشغل في الشركات الكبيرة',
        en: 'Relatively manageable · Opens doors in Business Analysis and ERP · Good for corporate work',
      },
      cons: {
        ar: 'البرمجة فيه مش على مستوى CS · محتاج تكمّل تعليمك الذاتي في التقنيات الحديثة',
        en: 'Programming not as deep as CS · Need self-study in modern tech',
      },
      suitableFor: {
        ar: 'اللي بيحب يكون جسر بين التقنية والأعمال · اللي مهتم بالـ Data Analysis والـ Business Intelligence',
        en: 'Those who want to bridge technology and business',
      },
      icon: 'Database', color: 'indigo', order: 2,
    },
    {
      slug: 'it',
      name: { ar: 'تكنولوجيا المعلومات', en: 'Information Technology' },
      type: 'general',
      description: {
        ar: 'بيركز على الشبكات، السيرفرات، وإدارة البنية التحتية التقنية للمؤسسات. لو بتحب الهاردوير والشبكات وإدارة الأنظمة أكتر من الكود، ده قسمك.',
        en: 'Focuses on networks, servers and infrastructure management.',
      },
      pros: {
        ar: 'مطلوب في كل شركة · الشغل فيه واضح ومحدد · فرص Freelance ممتازة في إعداد الشبكات',
        en: 'Needed everywhere · Clear job scope · Great freelance opportunities',
      },
      cons: {
        ar: 'أقل في الـ Software Development · محتاج شهادات احترافية زي CCNA للتميز',
        en: 'Less software development · Need professional certifications like CCNA',
      },
      suitableFor: {
        ar: 'اللي بيحب الهاردوير والشبكات · اللي مهتم بأمن وإدارة الأنظمة',
        en: 'Those interested in hardware, networks and system administration',
      },
      icon: 'Globe', color: 'emerald', order: 3,
    },
    {
      slug: 'ai',
      name: { ar: 'الذكاء الاصطناعي', en: 'Artificial Intelligence' },
      type: 'special',
      description: {
        ar: 'أحدث وأقوى قسم في الكلية. بتتعلم فيه Machine Learning، Deep Learning، معالجة اللغات الطبيعية، والرؤية الحاسوبية. مجال المستقبل اللي بيغير العالم.',
        en: 'Most modern department. Learn ML, Deep Learning, NLP and Computer Vision.',
      },
      pros: {
        ar: 'مجال المستقبل · مرتبات خيالية عالمياً · تنوع هائل في التطبيقات · فرص بحثية قوية',
        en: 'Future field · Incredible global salaries · Huge application diversity · Research opportunities',
      },
      cons: {
        ar: 'محتاج رياضة قوية جداً (Calculus, Linear Algebra, Statistics) · بياخد وقت عشان تشوف نتائج',
        en: 'Requires strong math · Takes time to see results',
      },
      suitableFor: {
        ar: 'اللي عنده موهبة في الرياضة · اللي بيحب البحث والابتكار · اللي عاوز يكون في قلب ثورة التكنولوجيا',
        en: 'Those with math talent who love research and innovation',
      },
      icon: 'Cpu', color: 'purple', order: 4,
    },
    {
      slug: 'cyber',
      name: { ar: 'الأمن السيبراني', en: 'Cyber Security' },
      type: 'special',
      description: {
        ar: 'بيعلمك إزاي تحمي الأنظمة وتكتشف الثغرات قبل الهاكرز الحقيقيين. تعلم Ethical Hacking، Penetration Testing، وتأمين البيانات والأنظمة.',
        en: 'Learn to protect systems and discover vulnerabilities. Ethical Hacking and Penetration Testing.',
      },
      pros: {
        ar: 'نقص حاد في المتخصصين عالمياً · مرتبات مرتفعة جداً · شغل مثير ومتحدي · فرص حكومية وخاصة',
        en: 'Global shortage of specialists · Very high salaries · Exciting work · Government and private sector opportunities',
      },
      cons: {
        ar: 'محتاج خلفية قوية في الشبكات والأنظمة الأول · القوانين والأخلاقيات مهمة جداً',
        en: 'Needs strong networking and systems background · Ethics and laws are critical',
      },
      suitableFor: {
        ar: 'اللي بيحب التحديات وحل الألغاز · اللي عنده فضول معرفي بطبيعة الأنظمة وكيف تُخترق',
        en: 'Those who love challenges and puzzles and are curious about how systems can be compromised',
      },
      icon: 'ShieldAlert', color: 'red', order: 5,
    },
  ]);
  console.log('🏛️  Departments created (5 departments)');

  // ── Careers ───────────────────────────────────────────────────
  await Career.insertMany([
    {
      slug: 'cs-foundation',
      difficulty: 'beginner',
      name: { ar: 'تأسيس علوم الحاسب', en: 'CS Foundation' },
      description: {
        ar: 'البداية الصح لأي طالب حاسبات. من غير أساس قوي هتبقى مبرمج ناقص مهما تعلمت تقنيات. ده مش مسار وظيفي، ده اللي هيخليك تتقدم في أي مسار تانٍ.',
        en: 'The right start for any CS student. Without a solid foundation, you will always be an incomplete developer.',
      },
      why: {
        ar: 'لأن الشركات الكبيرة زي Google وMeta بتسأل فيه في الـ Interviews. وبيخليك تفهم الـ "لماذا" مش بس الـ "كيف".',
        en: 'Because big companies like Google and Meta ask about it in interviews. It helps you understand the "why" not just the "how".',
      },
      icon: 'Layers', color: 'gray', order: 1,
      levels: [
        {
          title: 'المرحلة ١ — الخوارزميات وهياكل البيانات', order: 1,
          items: [
            { name: 'Big O Notation', detail: 'تحليل كفاءة الكود من حيث الزمن والذاكرة', resourceUrl: 'https://www.youtube.com/watch?v=Mo4vesaut8g' },
            { name: 'Arrays & Strings', detail: 'أكثر شيء بيجي في الـ Interviews' },
            { name: 'Linked Lists', detail: 'Singly, Doubly, Circular' },
            { name: 'Stack & Queue', detail: 'مع تطبيقاتهم العملية' },
            { name: 'Trees & Graphs', detail: 'Binary Search Tree, DFS, BFS' },
            { name: 'Hash Tables', detail: 'الـ HashMap وعمله من جوه', resourceUrl: 'https://www.youtube.com/watch?v=jalSiaIi8j4' },
          ],
        },
        {
          title: 'المرحلة ٢ — نظم التشغيل وأساسيات الشبكات', order: 2,
          items: [
            { name: 'Processes & Threads', detail: 'الفرق بينهم وإدارة التزامن (Concurrency)' },
            { name: 'Memory Management', detail: 'Stack vs Heap، الـ Garbage Collection' },
            { name: 'TCP/IP Basics', detail: 'كيف البيانات بتتنقل على الإنترنت' },
            { name: 'HTTP & REST', detail: 'أساس أي Web Application' },
          ],
        },
        {
          title: 'المرحلة ٣ — التدريب على المسائل', order: 3,
          items: [
            { name: 'LeetCode Easy', detail: 'ابدأ بـ 50 مسألة Easy قبل ما تتحرك', resourceUrl: 'https://leetcode.com' },
            { name: 'LeetCode Medium', detail: 'الـ Level الحقيقي للـ Interviews' },
            { name: 'Blind 75 List', detail: 'أهم 75 مسألة هتقابلك في الـ Interviews', resourceUrl: 'https://neetcode.io' },
          ],
        },
      ],
    },
    {
      slug: 'frontend',
      difficulty: 'beginner',
      name: { ar: 'تطوير الواجهات', en: 'Frontend Development' },
      description: {
        ar: 'أنت المسؤول عن كل حاجة المستخدم بيشوفها ويلمسها. من الزر اللي بيضغطه لحد الـ Animation الجميلة. الـ Frontend Developer بيحوّل التصميم لحاجة شغّالة حقيقية.',
        en: 'You are responsible for everything the user sees and touches. From the button they click to beautiful animations.',
      },
      why: {
        ar: 'لو بتحب تشوف نتيجة كودك فوراً قدامك، وبتحب التصميم والتفاعل والتجربة البصرية، ده مجالك.',
        en: 'If you love seeing your code results immediately and enjoy design and visual experience, this is your field.',
      },
      icon: 'Layout', color: 'blue', order: 2,
      levels: [
        {
          title: 'المرحلة ١ — الأساسيات (لازم تتقنها)', order: 1,
          items: [
            { name: 'HTML5 Semantics', detail: 'مش مجرد tags، فهم المعنى ورا كل عنصر', resourceUrl: 'https://www.youtube.com/watch?v=kUMe1FH4CHE' },
            { name: 'CSS3 الحديث', detail: 'Flexbox, Grid, Animations, Variables', resourceUrl: 'https://www.youtube.com/watch?v=1Rs2ND1ryYc' },
            { name: 'JavaScript ES6+', detail: 'Promises, Async/Await, Destructuring, Modules' },
            { name: 'DOM Manipulation', detail: 'التعامل مع الصفحة ديناميكياً', resourceUrl: 'https://www.youtube.com/watch?v=5fb2aPlgoys' },
            { name: 'Git & GitHub', detail: 'لازم تبدأ بيه من اليوم الأول', resourceUrl: 'https://www.youtube.com/watch?v=RGOj5yH7evk' },
          ],
        },
        {
          title: 'المرحلة ٢ — اختر Framework', order: 2, isChoice: true,
          choices: [
            { path: 'React.js (الأكثر طلباً)', steps: ['React Hooks (useState, useEffect)', 'React Router للتنقل', 'Context API أو Zustand', 'Tailwind CSS', 'Next.js للـ SSR والـ SEO'] },
            { path: 'Vue.js (الأسهل للمبتدئين)', steps: ['Vue 3 Composition API', 'Vue Router', 'Pinia للـ State Management', 'Nuxt.js'] },
          ],
        },
        {
          title: 'المرحلة ٣ — احتراف وأدوات', order: 3,
          items: [
            { name: 'TypeScript', detail: 'بقى ضروري في أي Job Description جدي', resourceUrl: 'https://www.youtube.com/watch?v=30LWjhZzg50' },
            { name: 'Testing', detail: 'Jest, React Testing Library' },
            { name: 'Performance', detail: 'Lazy Loading, Code Splitting, Web Vitals' },
            { name: 'Build ملف Portfolio', detail: '3-4 مشاريع حقيقية على GitHub' },
          ],
        },
      ],
    },
    {
      slug: 'backend',
      difficulty: 'intermediate',
      name: { ar: 'تطوير الخوادم', en: 'Backend Development' },
      description: {
        ar: 'أنت العقل المدبر اللي خلف الكواليس. بتبني الـ APIs، بتتعامل مع الداتابيز، وبتضمن إن النظام شغّال بسرعة وأمان حتى لو في مليون مستخدم.',
        en: 'You are the hidden engine. You build APIs, handle databases, and ensure the system runs fast and securely.',
      },
      why: {
        ar: 'لو بتحب المنطق والأنظمة المعقدة، وبتحب تبني حاجات مش بتظهر بس بتشتغل بشكل خيالي، ده مجالك.',
        en: 'If you love logic and complex systems, and enjoy building things that work invisibly, this is your field.',
      },
      icon: 'Server', color: 'emerald', order: 3,
      levels: [
        {
          title: 'المرحلة ١ — اختر لغتك', order: 1, isChoice: true,
          choices: [
            { path: 'Node.js + JavaScript', steps: ['Express.js Framework', 'Async Programming', 'REST API Design', 'Error Handling Middleware'] },
            { path: 'Python', steps: ['FastAPI أو Django REST', 'Virtual Environments', 'Async Python', 'Pydantic Schemas'] },
            { path: 'Java (للشركات الكبيرة)', steps: ['Spring Boot', 'Maven/Gradle', 'Spring Security', 'JPA/Hibernate'] },
          ],
        },
        {
          title: 'المرحلة ٢ — قواعد البيانات', order: 2,
          items: [
            { name: 'SQL (PostgreSQL)', detail: 'الأساس، لازم تعرفه كويس', resourceUrl: 'https://www.youtube.com/watch?v=qw--VYLpxG4' },
            { name: 'NoSQL (MongoDB)', detail: 'للتطبيقات الحديثة والـ Flexible Schema' },
            { name: 'Redis', detail: 'Caching وتسريع الـ API responses' },
            { name: 'Database Design', detail: 'Normalization, Indexing, Query Optimization' },
          ],
        },
        {
          title: 'المرحلة ٣ — Advanced Topics', order: 3,
          items: [
            { name: 'Authentication & Security', detail: 'JWT, OAuth2, Password Hashing, HTTPS' },
            { name: 'Docker', detail: 'Containerization للـ Deployment', resourceUrl: 'https://www.youtube.com/watch?v=3c-iBn73dDE' },
            { name: 'System Design Basics', detail: 'Load Balancing, Caching, Microservices' },
            { name: 'Cloud Basics', detail: 'AWS أو Azure أو Google Cloud' },
          ],
        },
      ],
    },
    {
      slug: 'fullstack',
      difficulty: 'intermediate',
      name: { ar: 'المطور الشامل', en: 'Full Stack Development' },
      description: {
        ar: 'بتبني المشروع كامل من الصفر لوحدك. فرونت وباك وداتابيز ودیبلوی. الـ Full Stack Developer هو اللي بيقدر يشتغل على أي جزء في التطبيق.',
        en: 'You build the entire project from scratch. Frontend, backend, database and deployment all by yourself.',
      },
      why: {
        ar: 'لو عاوز تعمل مشاريع Freelance لوحدك، أو تبني Startup، أو تفهم كل جزء في الـ Application.',
        en: 'If you want to do freelance projects alone, build a startup, or understand every part of an application.',
      },
      icon: 'Layers', color: 'violet', order: 4,
      levels: [
        {
          title: 'المرحلة ١ — Frontend أولاً', order: 1,
          items: [
            { name: 'HTML + CSS + JavaScript', detail: 'الأساس قبل أي حاجة' },
            { name: 'React.js', detail: 'الـ Framework الأكثر طلباً في الـ Full Stack' },
            { name: 'State Management', detail: 'Context API، Zustand، أو Redux' },
          ],
        },
        {
          title: 'المرحلة ٢ — Backend وـ Database', order: 2,
          items: [
            { name: 'Node.js + Express', detail: 'نفس لغة الفرونت، بداية سهلة للـ Full Stack' },
            { name: 'REST API Design', detail: 'بناء APIs واضحة ومنظمة' },
            { name: 'MongoDB أو PostgreSQL', detail: 'اختار واحد وأتقنه' },
            { name: 'Authentication', detail: 'JWT، Sessions، OAuth' },
          ],
        },
        {
          title: 'المرحلة ٣ — Deployment وـ DevOps أساسي', order: 3,
          items: [
            { name: 'Git + GitHub', detail: 'Version Control ضروري', resourceUrl: 'https://github.com' },
            { name: 'Vercel / Netlify', detail: 'Deploy الفرونت بضغطة' },
            { name: 'Railway / Render', detail: 'Deploy الباك مجاناً' },
            { name: 'Environment Variables', detail: 'إدارة الأسرار والإعدادات' },
            { name: 'ابني مشاريع حقيقية', detail: 'Portfolio قوي = وظيفة سريعة' },
          ],
        },
      ],
    },
    {
      slug: 'mobile',
      difficulty: 'intermediate',
      name: { ar: 'تطوير تطبيقات الجوال', en: 'Mobile App Development' },
      description: {
        ar: 'بتبني تطبيقات شغّالة على Android وiOS. تقدر تشتغل بـ Native (Java/Kotlin أو Swift) أو بـ Cross-platform (Flutter أو React Native) بكود واحد.',
        en: 'Build apps that run on Android and iOS, either natively or cross-platform.',
      },
      why: {
        ar: 'لو عاوز تبني حاجة يشوفها الناس على موبايلاتهم يومياً وتلمس فيها الـ Hardware زي الكاميرا والـ GPS.',
        en: 'If you want to build things people use daily on their phones and interact with hardware like camera and GPS.',
      },
      icon: 'Smartphone', color: 'rose', order: 5,
      levels: [
        {
          title: 'المرحلة ١ — اختر مسارك', order: 1, isChoice: true,
          choices: [
            { path: 'Flutter (الأسرع والأكثر طلباً)', steps: ['Dart Programming Language', 'Flutter Widgets', 'State Management (Riverpod/Bloc)', 'Platform Channels', 'Firebase Integration'] },
            { path: 'React Native (لو جاي من Web)', steps: ['React Native Components', 'Expo Framework', 'React Navigation', 'Native Modules'] },
            { path: 'Native Android (Kotlin)', steps: ['Kotlin Basics', 'Android SDK', 'Jetpack Compose', 'Room Database', 'MVVM Architecture'] },
          ],
        },
        {
          title: 'المرحلة ٢ — Backend والـ Services', order: 2,
          items: [
            { name: 'Firebase', detail: 'Authentication, Firestore, Push Notifications', resourceUrl: 'https://firebase.google.com' },
            { name: 'REST API Integration', detail: 'ربط التطبيق بـ Backend خارجي' },
            { name: 'Local Storage', detail: 'SQLite، SharedPreferences، Hive' },
          ],
        },
        {
          title: 'المرحلة ٣ — نشر التطبيق', order: 3,
          items: [
            { name: 'Google Play Store', detail: 'متطلبات النشر والـ App Signing' },
            { name: 'Apple App Store', detail: 'محتاج Mac وـ Developer Account' },
            { name: 'App Performance', detail: 'Optimization للـ Battery والـ Memory' },
          ],
        },
      ],
    },
    {
      slug: 'data-analysis',
      difficulty: 'intermediate',
      name: { ar: 'تحليل البيانات', en: 'Data Analysis' },
      description: {
        ar: 'بتحوّل الأرقام والبيانات الخام لقصص ومعلومات تساعد الشركات تاخد قرارات أذكى. أداتك الرئيسية هي Python أو SQL وأدوات تصوير البيانات.',
        en: 'Transform raw numbers and data into stories and insights that help companies make smarter decisions.',
      },
      why: {
        ar: 'لو بتحب الإحصاء وبتتساءل دايماً "ليه؟" لما بتشوف أرقام، وبتحب تحوّل الداتا لقصة واضحة.',
        en: 'If you love statistics and always ask "why?" when you see numbers, and enjoy turning data into clear stories.',
      },
      icon: 'Database', color: 'amber', order: 6,
      levels: [
        {
          title: 'المرحلة ١ — الأدوات الأساسية', order: 1,
          items: [
            { name: 'Python للتحليل', detail: 'أقوى لغة في Data Science', resourceUrl: 'https://www.youtube.com/watch?v=rfscVS0vtbw' },
            { name: 'NumPy & Pandas', detail: 'التعامل مع الجداول والمصفوفات', resourceUrl: 'https://www.youtube.com/watch?v=vmEHCJofslg' },
            { name: 'SQL للبيانات', detail: 'استخراج البيانات من قواعد البيانات' },
            { name: 'Excel & Google Sheets', detail: 'لسه مطلوب في كتير من الوظائف' },
          ],
        },
        {
          title: 'المرحلة ٢ — تصوير البيانات', order: 2,
          items: [
            { name: 'Matplotlib & Seaborn', detail: 'رسم الجراف والمخططات' },
            { name: 'Power BI أو Tableau', detail: 'Dashboards تفاعلية للإدارة', resourceUrl: 'https://www.youtube.com/watch?v=ykvAWKML9Gk' },
            { name: 'Storytelling بالداتا', detail: 'تقديم النتائج لغير التقنيين' },
          ],
        },
        {
          title: 'المرحلة ٣ — Machine Learning أساسي', order: 3,
          items: [
            { name: 'Statistics & Probability', detail: 'الأساس النظري للـ ML' },
            { name: 'Scikit-learn', detail: 'Classification, Regression, Clustering' },
            { name: 'Feature Engineering', detail: 'تحسين الداتا قبل التدريب' },
          ],
        },
      ],
    },
    {
      slug: 'ai-ml',
      difficulty: 'advanced',
      name: { ar: 'الذكاء الاصطناعي وتعلم الآلة', en: 'AI & Machine Learning' },
      description: {
        ar: 'بتعلّم الآلات إزاي تفكر وتتوقع وتبدع. من نماذج التعرف على الصور لأنظمة توليد النصوص زي ChatGPT. ده مجال المستقبل اللي بيغير كل صناعة.',
        en: 'Teach machines how to think, predict and create. From image recognition to text generation like ChatGPT.',
      },
      why: {
        ar: 'لو عندك شغف بالرياضة والإحصاء وعاوز تكون جزء من الثورة التقنية الحقيقية وتبني أنظمة ذكية.',
        en: 'If you have a passion for math and statistics and want to be part of the real tech revolution.',
      },
      icon: 'Bot', color: 'purple', order: 7,
      levels: [
        {
          title: 'المرحلة ١ — الأساس الرياضي', order: 1,
          items: [
            { name: 'Linear Algebra', detail: 'Vectors, Matrices, Transformations - قلب الـ ML', resourceUrl: 'https://www.youtube.com/watch?v=fNk_zzaMoSs' },
            { name: 'Calculus', detail: 'Derivatives, Chain Rule - للـ Backpropagation' },
            { name: 'Probability & Statistics', detail: 'Distributions, Bayes Theorem, Hypothesis Testing' },
            { name: 'Python مع NumPy', detail: 'لازم تكون راحت معاك جداً' },
          ],
        },
        {
          title: 'المرحلة ٢ — Machine Learning الكلاسيكي', order: 2,
          items: [
            { name: 'Supervised Learning', detail: 'Linear/Logistic Regression, Decision Trees, SVM', resourceUrl: 'https://www.coursera.org/learn/machine-learning' },
            { name: 'Unsupervised Learning', detail: 'Clustering (K-Means), Dimensionality Reduction (PCA)' },
            { name: 'Model Evaluation', detail: 'Accuracy, Precision, Recall, Cross-Validation' },
            { name: 'Scikit-learn', detail: 'أسرع طريقة لتطبيق الـ Models' },
          ],
        },
        {
          title: 'المرحلة ٣ — Deep Learning', order: 3,
          items: [
            { name: 'Neural Networks', detail: 'Perceptrons, Activation Functions, Backprop' },
            { name: 'TensorFlow أو PyTorch', detail: 'PyTorch الأفضل للبحث، TensorFlow للـ Production', resourceUrl: 'https://www.youtube.com/watch?v=aircAruvnKk' },
            { name: 'CNN للصور', detail: 'Convolutional Neural Networks' },
            { name: 'NLP وـ Transformers', detail: 'BERT, GPT Architecture' },
          ],
        },
      ],
    },
    {
      slug: 'cyber-security',
      difficulty: 'advanced',
      name: { ar: 'الأمن السيبراني', en: 'Cyber Security' },
      description: {
        ar: 'أنت الحارس. بتحمي الأنظمة من الاختراق وبتكتشف الثغرات قبل ما الهاكرز الحقيقيين يستغلوها. الـ Ethical Hacker هو اللي بيفكر زي المجرم عشان يحمي الضحية.',
        en: 'You are the guardian. Protect systems from breaches and discover vulnerabilities before real hackers exploit them.',
      },
      why: {
        ar: 'لو بتحب التحدي والألغاز، وبتتساءل دايماً إزاي الحاجات دي ممكن تتاخد، وعندك أخلاق قوية.',
        en: 'If you love challenges and puzzles and always wonder how things can be compromised, with strong ethics.',
      },
      icon: 'ShieldCheck', color: 'cyan', order: 8,
      levels: [
        {
          title: 'المرحلة ١ — الأساس التقني', order: 1,
          items: [
            { name: 'Networking Fundamentals', detail: 'TCP/IP, DNS, HTTP/S, Firewalls - لازم تفهمها كويس', resourceUrl: 'https://www.youtube.com/watch?v=qiQR5rTSshw' },
            { name: 'Linux Command Line', detail: 'معظم الـ Tools بتشتغل على Linux', resourceUrl: 'https://www.youtube.com/watch?v=oxuRxtrO2Ag' },
            { name: 'Python Scripting', detail: 'لكتابة أدوات الـ Security الخاصة بيك' },
            { name: 'Cryptography Basics', detail: 'Encryption, Hashing, PKI' },
          ],
        },
        {
          title: 'المرحلة ٢ — Ethical Hacking', order: 2,
          items: [
            { name: 'Kali Linux', detail: 'الـ Distribution المخصصة للـ Penetration Testing' },
            { name: 'OWASP Top 10', detail: 'أشهر ثغرات الويب وكيف تكتشفها', resourceUrl: 'https://owasp.org/www-project-top-ten/' },
            { name: 'Network Scanning', detail: 'Nmap, Wireshark' },
            { name: 'Web App Pentesting', detail: 'SQL Injection, XSS, CSRF, Buffer Overflow' },
            { name: 'TryHackMe / HackTheBox', detail: 'منصات التدريب العملي الأفضل', resourceUrl: 'https://tryhackme.com' },
          ],
        },
        {
          title: 'المرحلة ٣ — التخصص والشهادات', order: 3,
          items: [
            { name: 'CompTIA Security+', detail: 'أول شهادة معترف بيها للدخول للمجال', resourceUrl: 'https://www.comptia.org/certifications/security' },
            { name: 'CEH (Certified Ethical Hacker)', detail: 'شهادة الـ Ethical Hacking الرسمية' },
            { name: 'OSCP', detail: 'الأصعب والأقوى في الـ Penetration Testing' },
            { name: 'Bug Bounty Programs', detail: 'اشتغل مع شركات حقيقية وكسب مكافآت', resourceUrl: 'https://hackerone.com' },
          ],
        },
      ],
    },
  ]);
  console.log('🗺️  Careers created (8 career tracks)');

  // ── Courses ───────────────────────────────────────────────────
  await Course.insertMany([
    { title: { ar: 'كورس HTML و CSS الشامل', en: 'Complete HTML & CSS Course' }, description: { ar: 'من الصفر للاحتراف في HTML5 وCSS3 الحديث' }, platform: 'YouTube', url: 'https://www.youtube.com/watch?v=G3e-cpL7ofc', price: 0, category: 'Frontend', level: 'beginner', language: 'ar', order: 1 },
    { title: { ar: 'JavaScript للمبتدئين', en: 'JavaScript for Beginners' }, description: { ar: 'أتعلم JavaScript من الصفر مع مشاريع حقيقية' }, platform: 'YouTube', url: 'https://www.youtube.com/watch?v=PkZNo7MFNFg', price: 0, category: 'Frontend', level: 'beginner', language: 'ar', order: 2 },
    { title: { ar: 'React.js كاملاً', en: 'Complete React.js Course' }, description: { ar: 'تعلم React من الأساس لبناء تطبيقات احترافية' }, platform: 'YouTube', url: 'https://www.youtube.com/watch?v=bMknfKXIFA8', price: 0, category: 'Frontend', level: 'intermediate', language: 'en', order: 3 },
    { title: { ar: 'Node.js و Express', en: 'Node.js & Express' }, description: { ar: 'بناء REST APIs احترافية مع Node.js و Express' }, platform: 'YouTube', url: 'https://www.youtube.com/watch?v=Oe421EPjeBE', price: 0, category: 'Backend', level: 'intermediate', language: 'en', order: 4 },
    { title: { ar: 'Python للجميع', en: 'Python for Everybody' }, description: { ar: 'كورس Python الأشهر عالمياً على Coursera مجاناً' }, platform: 'Coursera', url: 'https://www.coursera.org/specializations/python', price: 0, category: 'Data Science', level: 'beginner', language: 'en', order: 5 },
    { title: { ar: 'The Complete SQL Bootcamp', en: 'Complete SQL Bootcamp' }, description: { ar: 'أتعلم SQL من الصفر للاحتراف' }, platform: 'Udemy', url: 'https://www.udemy.com/course/the-complete-sql-bootcamp/', price: 199, category: 'Backend', level: 'beginner', language: 'en', order: 6 },
    { title: { ar: 'Machine Learning بـ Andrew Ng', en: 'Machine Learning by Andrew Ng' }, description: { ar: 'أشهر كورس Machine Learning في العالم' }, platform: 'Coursera', url: 'https://www.coursera.org/learn/machine-learning', price: 0, category: 'AI & ML', level: 'intermediate', language: 'en', order: 7 },
    { title: { ar: 'Flutter والتطبيقات', en: 'Flutter App Development' }, description: { ar: 'بناء تطبيقات جوال احترافية بـ Flutter' }, platform: 'YouTube', url: 'https://www.youtube.com/watch?v=1gDhl4leEzA', price: 0, category: 'Mobile', level: 'intermediate', language: 'ar', order: 8 },
  ]);
  console.log('📖 Courses created (8 courses)');

  console.log('\n✅ Seed completed!');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`Admin:   ${ADMIN_EMAIL}  /  ${ADMIN_PASSWORD}`);
  console.log(`Student: ${STUDENT_EMAIL}  /  ${STUDENT_PASSWORD}`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  process.exit(0);
};

seed().catch((err) => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});