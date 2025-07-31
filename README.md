# 🎨 راهنمای بک‌اند استودیو نقاشی

## 📋 فهرست مطالب
- [معرفی](#-معرفی)
- [معماری کلی](#-معماری-کلی)
- [تکنولوژی‌های استفاده شده](#-تکنولوژیهای-استفاده-شده)
- [مدل داده](#-مدل-داده)
- [احراز هویت](#-احراز-هویت)
- [API Endpoints](#-api-endpoints)
- [ویژگی‌های کلیدی](#-ویژگیهای-کلیدی)
- [راه‌اندازی](#-راهاندازی)

---

## 🚀 معرفی

بک‌اند یک اپلیکیشن نقاشی آنلاین که به کاربران امکان ایجاد، ذخیره و اشتراک‌گذاری نقاشی‌های دیجیتال را می‌دهد. سیستم از معماری RESTful API استفاده می‌کند و قابلیت‌های مدیریت کاربر، احراز هویت، و ذخیره‌سازی نقاشی‌ها را ارائه می‌دهد.

### ویژگی‌های اصلی:
- 🔐 احراز هویت JWT-based
- 🎨 ذخیره نقاشی‌ها در فرمت JSON
- 👥 مدیریت کاربران و پروفایل‌ها
- 🔍 جستجو و فیلتر نقاشی‌ها
- 📊 سیستم تگ‌گذاری و دسته‌بندی
- 🔒 کنترل دسترسی و مجوزها

---

## 🏗️ معماری کلی

### الگوی MVC
پروژه از الگوی **Model-View-Controller** استفاده می‌کند:
- **Models**: اسکیماهای User و Painting
- **Controllers**: منطق کسب‌وکار و پردازش درخواست‌ها
- **Routes**: تعریف endpoints و اتصال به controllers
- **Middleware**: احراز هویت، اعتبارسنجی، و مدیریت خطا

### Flow درخواست‌ها
Client Request → Middleware (Auth/Validation) → Controller → Model → Database
↓
Client Response ← JSON Response ← Business Logic ← Data Processing


---

## 💻 تکنولوژی‌های استفاده شده

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: SQLite
- **Authentication**: JWT (jsonwebtoken)
- **Security**: bcryptjs, helmet, cors

---

## 🗄️ مدل داده

### User Model
- اطلاعات پایه: username, hashed password
- metadata: تاریخ ایجاد

### Painting Model
- اطلاعات نقاشی: title, owner reference
- داده‌های کانواس: paintingData (JSON object)
- metadata: اندازه کانواس

---

## 🔐 احراز هویت

### JWT Strategy
- **Registration**: hash password با bcrypt، ایجاد کاربر، تولید JWT
- **Login**: اعتبارسنجی credentials، تولید JWT جدید
- **Authorization**: middleware بررسی token در headers
- **Token Management**: expiration 7 روز، refresh قابلیت اضافه کردن

---

## 🛠️ API Endpoints

### Authentication (`/api/auth`)
- `POST /register` - ثبت‌نام کاربر جدید
- `POST /login` - ورود به سیستم

### Paintings (`/api/paintings`)
- `GET /` - لیست نقاشی‌های کاربر (با pagination و search)
- `POST /` - ذخیره نقاشی جدید
- `GET /:id` - دریافت جزئیات یک نقاشی
- `PUT /:id` - بروزرسانی نقاشی
- `DELETE /:id` - حذف نقاشی

---

## ⚙️ ویژگی‌های کلیدی

### مدیریت خطا
- Centralized error handling middleware
- مدیریت خطاهای SQLite (validation, duplicate key)
- مدیریت خطاهای JWT
- لاگ‌گیری خطاها برای debugging

---

## 🚀 راه‌اندازی

### متغیرهای محیطی مورد نیاز
```env
PORT=5001
JWT_SECRET=your_secret_key
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

### مراحل راه‌اندازی
1. نصب dependencies: `npm install`
2. تنظیم فایل `.env`
3. شروع سرور: `npm run dev`

### Health Check
- Endpoint: `GET /api/health`
- بررسی وضعیت سرور و اتصال پایگاه داده

---

## 🔧 نکات پیاده‌سازی

### Data Validation
- Schema validation در سطح SQLite
- Request validation در controllers

### Error Handling
- Try-catch blocks در همه controllers
- Custom error classes
- مدیریت async errors

### Future Enhancements
- File upload برای avatars
- Real-time collaboration با Socket.io
