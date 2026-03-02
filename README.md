# جمعية الرعاية الخيرية - الواجهة الأمامية 🎨

مشروع React + TypeScript + Vite لموقع جمعية الرعاية الخيرية.

## 🚀 الميزات

- ⚡ **سريع**: مبني بـ Vite لأداء ممتاز
- 🎨 **قابل للتخصيص**: نظام ألوان وخطوط شامل
- 📱 **متجاوب**: يعمل على جميع الأجهزة
- 🔧 **سهل الصيانة**: كود منظم ومُعلق
- 🌐 **متعدد اللغات**: دعم كامل للعربية

## 📋 المتطلبات

- Node.js 18+
- npm أو yarn

## 🛠️ التثبيت والتشغيل

```bash
# استنساخ المشروع
git clone https://github.com/yourusername/association-frontend.git
cd association-frontend

# تثبيت التبعيات
npm install

# تشغيل المشروع محلياً
npm run dev

# البناء للإنتاج
npm run build
```

## 🔧 إعداد متغيرات البيئة

أنشئ ملف `.env` في المجلد الجذر:

```env
# API Base URL (رابط الباك اند)
VITE_API_BASE=https://your-backend-domain.com/api/public

# CMS Base URL (للملفات المرفوعة)
VITE_CMS_BASE=https://your-backend-domain.com
```

## 📁 هيكل المشروع

```
src/
├── components/          # المكونات المشتركة
│   ├── Header.tsx      # الهيدر مع التنقل
│   ├── Footer.tsx      # الفوتر
│   ├── ThemeProvider.tsx # إدارة الألوان والخطوط
│   └── CmsImage.tsx    # عرض الصور من CMS
├── pages/              # صفحات الموقع
│   ├── Home.tsx        # الصفحة الرئيسية
│   ├── About.tsx       # من نحن
│   └── ...
├── lib/                # المساعدات والأدوات
│   └── api.ts          # اتصال بالباك اند
└── styles/             # ملفات التنسيق
```

## 🎨 نظام التخصيص

### الألوان
- 17 لون مختلف قابل للتخصيص
- تغيير فوري من لوحة التحكم
- دعم الوضع الفاتح والداكن

### الخطوط
- 13 إعداد خط مختلف
- دعم الخطوط العربية
- تخصيص أحجام العناوين

## 🚀 النشر

### Vercel (مجاني)
```bash
# ربط مع Vercel
npm i -g vercel
vercel

# متغيرات البيئة في Vercel Dashboard
VITE_API_BASE=https://your-api-domain.com/api/public
VITE_CMS_BASE=https://your-api-domain.com
```

### Netlify (مجاني)
```bash
# ربط مع Netlify
npm i -g netlify-cli
netlify init

# متغيرات البيئة في Netlify Dashboard
VITE_API_BASE=https://your-api-domain.com/api/public
VITE_CMS_BASE=https://your-api-domain.com
```

## 🔄 التحديثات

عند تحديث الباك اند:
1. تأكد من تحديث `VITE_API_BASE`
2. اختبر جميع الصفحات
3. تحقق من أزرار Debug

## 🐛 استكشاف الأخطاء

### لا تحمل الألوان؟
```bash
# اضغط F12 → Console
# ابحث عن: "🎨 Loading theme settings"
# تأكد من VITE_API_BASE صحيح
```

### لا تحمل الصور؟
```bash
# تحقق من VITE_CMS_BASE
# تأكد من رفع الملفات في CMS
```

## 📞 الدعم

للمساعدة أو الإبلاغ عن مشاكل:
1. تحقق من Console للأخطاء
2. تأكد من إعدادات البيئة
3. راجع ملفات التوثيق

---

**🎉 موقع جميل وقابل للتخصيص بالكامل!**