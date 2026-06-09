const { GoogleGenerativeAI } = require('@google/generative-ai');

const buildSystemPrompt = (userName, language) => `
You are an intelligent academic assistant for FCI (Faculty of Computer and Information), a university platform.

Student name: ${userName || 'Student'}
Response language: ${language === 'ar' ? 'Arabic (العربية) — always respond in Arabic' : 'English — always respond in English'}

Your expertise covers:
1. Academic subjects (4 years): Mathematics, Physics, CS Intro, OOP, Data Structures, Algorithms, Databases, OS, Networks, Software Engineering, Web Development, Graduation Project
2. Career tracks: Frontend, Backend, Full Stack, Mobile (Flutter/React Native), Data Analysis, AI & Machine Learning, Cyber Security, CS Foundation
3. University departments: CS, IS, IT, AI, Cyber Security — differences, pros/cons, job opportunities
4. Study tips, learning resources, roadmaps
5. Programming help (explain concepts, debug logic, suggest learning paths)
6. General university life advice

Response style:
- Be friendly, encouraging, and concise
- Use bullet points for lists
- Keep responses under 300 words unless a detailed explanation is needed
- If asked about something outside your scope, politely redirect
- Always be supportive and motivating
`.trim();

// ─────────────────────────────────────────────────────────────────
// @desc    إرسال رسالة للـ AI (Gemini) وجلب الرد
// @route   POST /api/chat
// @access  Private
// ─────────────────────────────────────────────────────────────────
const sendMessage = async (req, res) => {
  const { messages, language } = req.body;

  if (!process.env.GEMINI_API_KEY) {
    return res.status(503).json({
      success: false,
      message: language === 'ar'
        ? '⚠️ خدمة الذكاء الاصطناعي غير مفعّلة. تأكد من إعداد GEMINI_API_KEY في ملف .env'
        : '⚠️ AI service not configured. Set GEMINI_API_KEY in .env file',
    });
  }

  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ success: false, message: 'messages مطلوبة' });
  }

  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      systemInstruction: buildSystemPrompt(req.user?.name, language || 'ar'),
    });

    // آخر رسالة هي اللي هنبعتها
    const lastMessage = messages[messages.length - 1].content;

    // بناء الـ history بشكل صحيح
    const history = [];
    const previousMessages = messages.slice(0, -1);

    for (const m of previousMessages) {
      const mappedRole = (m.role === 'assistant' || m.role === 'model') ? 'model' : 'user';

      // أول رسالة لازم تكون user
      if (history.length === 0 && mappedRole !== 'user') continue;

      // دمج المتشابهات بدل ما نكرر
      if (history.length > 0 && history[history.length - 1].role === mappedRole) {
        history[history.length - 1].parts[0].text += `\n${m.content}`;
      } else {
        history.push({ role: mappedRole, parts: [{ text: m.content }] });
      }
    }

    // لو آخر رسالة في الـ history كانت user، ادمجها مع الرسالة الجديدة
    let finalMessage = lastMessage;
    if (history.length > 0 && history[history.length - 1].role === 'user') {
      const last = history.pop();
      finalMessage = last.parts[0].text + '\n' + lastMessage;
    }

    const chat = model.startChat({
      history: history.length > 0 ? history : undefined,
    });

    const result = await chat.sendMessage(finalMessage);
    const reply = result.response.text();

    if (!reply) {
      return res.status(500).json({
        success: false,
        message: language === 'ar' ? 'لم يرد المساعد بشكل صحيح' : 'No response from assistant',
      });
    }

    res.json({ success: true, reply });

  } catch (error) {
    console.error('Gemini API error:', error.message);

    // أنواع الأخطاء
    if (error.message?.includes('API_KEY') || error.message?.includes('api key') || error.message?.includes('401')) {
      return res.status(401).json({
        success: false,
        message: language === 'ar'
          ? '⚠️ مفتاح GEMINI_API_KEY غير صالح — تحقق من قيمته في ملف .env'
          : '⚠️ Invalid GEMINI_API_KEY — check your .env file',
      });
    }

    if (error.message?.includes('quota') || error.message?.includes('429')) {
      return res.status(429).json({
        success: false,
        message: language === 'ar'
          ? 'تم تجاوز حد الطلبات المجاني — انتظر دقيقة وحاول مرة أخرى'
          : 'Free quota exceeded — wait a minute and try again',
      });
    }

    res.status(500).json({
      success: false,
      message: language === 'ar'
        ? 'حدث خطأ في خدمة الذكاء الاصطناعي، حاول مرة أخرى'
        : 'AI service error, please try again',
    });
  }
};

module.exports = { sendMessage };