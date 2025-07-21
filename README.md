# 📐 Canvas Drawing Tool - ابزار طراحی روی بوم

یک ابزار طراحی تعاملی ساخته شده با React.js که امکان کشیدن و رها کردن (Drag & Drop) اشکال هندسی را فراهم می‌کند.

## 📋 فهرست مطالب
- [ویژگی‌های کلیدی](#-ویژگیهای-کلیدی)
- [فناوری‌های استفاده شده](#-فناوریهای-استفاده-شده)
- [نصب و راه‌اندازی](#-نصب-و-راهاندازی)
- [ساختار پروژه](#-ساختار-پروژه)
- [نحوه کارکرد](#-نحوه-کارکرد)
- [اجزای اصلی](#-اجزای-اصلی)
- [پیاده‌سازی Drag & Drop](#-پیادهسازی-drag--drop)
- [شمارنده اشکال](#-شمارنده-اشکال)
- [استفاده](#-استفاده)

## 🌟 ویژگی‌های کلیدی

- **🎨 رابط کاربری مدرن**: طراحی شده با CSS3 و انیمیشن‌های نرم
- **🖱️ قابلیت Drag & Drop**: امکان کشیدن اشکال از نوار ابزار به بوم
- **📊 شمارش زنده**: نمایش تعداد هر نوع شکل به صورت real-time

## 🛠️ فناوری‌های استفاده شده

- **React.js** - کتابخانه اصلی جاوااسکریپت
- **CSS3** - برای استایل‌دهی و انیمیشن‌ها
- **React Hooks** - برای مدیریت state و lifecycle

## 🚀 نصب و راه‌اندازی

### پیش‌نیازها
- Node.js (نسخه 14 یا بالاتر)
- npm یا yarn

### مراحل نصب
```bash
# کلون کردن پروژه
git clone https://github.com/sepehrvahedi/paint-app.git

# وارد شدن به پوشه پروژه
cd paint-app

# نصب وابستگی‌ها
npm install

# اجرای پروژه
npm start
```
پروژه روی آدرس `http://localhost:3000` اجرا خواهد شد.

## 📁 ساختار پروژه

```
src/
├── components/
│   ├── Canvas.js          # کامپوننت اصلی بوم
│   ├── Toolbar.js         # نوار ابزار
│   └── ShapeCounter.js    # شمارنده اشکال
├── App.js                 # کامپوننت اصلی
├── App.css               # استایل‌های کلی
└── index.js              # نقطه ورود
```
## ⚙️ نحوه کارکرد

### معماری کلی
پروژه بر اساس معماری کامپوننت‌محور React ساخته شده است:

1. **کامپوننت App.js**: والد اصلی که state کلی را مدیریت می‌کند
2. **کامپوننت Toolbar.js**: شامل ابزارهای قابل کشیدن
3. **کامپوننت Canvas.js**: منطقه‌ای برای رها کردن اشکال
4. **کامپوننت ShapeCounter.js**: نمایش آمار اشکال

## 🧩 اجزای اصلی

### 1. نوار ابزار (Toolbar)
```javascript
const tools = [
    { id: 'circle', icon: '○', name: 'دایره', color: '#667eea' },
    { id: 'rectangle', icon: '▭', name: 'مستطیل', color: '#f093fb' },
    { id: 'triangle', icon: '△', name: 'مثلث', color: '#4facfe' },
    // ...
];
```

**ویژگی‌ها:**
- نمایش ابزارهای مختلف طراحی
- قابلیت drag برای هر ابزار
- راهنمای کوتاه برای کاربر

### 2. بوم (Canvas)
```javascript
const handleDrop = useCallback((e) => {
    e.preventDefault();
    if (draggedTool) {
        const newShape = {
            id: Date.now(),
            type: draggedTool.id,
            x: e.clientX - canvasRef.current.offsetLeft,
            y: e.clientY - canvasRef.current.offsetTop,
            color: draggedTool.color
        };
        setShapes(prev => [...prev, newShape]);
    }
}, [draggedTool]);
```

**ویژگی‌ها:**
- دریافت اشکال کشیده شده
- نمایش بصری هنگام drag over
- ذخیره موقعیت دقیق هر شکل

### 3. شمارنده (ShapeCounter)
```javascript
const shapeCounts = useMemo(() => {
    return shapes.reduce((acc, shape) => {
        acc[shape.type] = (acc[shape.type] || 0) + 1;
        return acc;
    }, {});
}, [shapes]);
```
**ویژگی‌ها:**
- محاسبه تعداد هر نوع شکل
- نمایش درصد هر شکل
- نوار پیشرفت تصویری

## 🎯 پیاده‌سازی Drag & Drop

### 1. آیتم‌های قابل کشیدن (Draggable Items)
```javascript
const handleDragStart = (e, tool) => {
    setDraggedTool(tool);
    e.dataTransfer.setData('text/plain', tool.id);
    e.target.classList.add('dragging');
};
```
### 2. منطقه رها کردن (Drop Zone)
```javascript
const handleDragOver = (e) => {
    e.preventDefault();
    e.currentTarget.classList.add('drag-over');
};
```
const handleDragLeave = (e) => {
    e.currentTarget.classList.remove('drag-over');
};

### 3. بازخورد بصری (Visual Feedback)
```css
.canvas.drag-over {
    background: linear-gradient(45deg, transparent 47%, #007bff 47%);
    animation: dragOverPattern 2s linear infinite;
}

.tool-button.dragging {
    opacity: 0.5;
    transform: scale(0.95);
}
```
## 📊 شمارنده اشکال

### محاسبه آمار
```javascript
const totalShapes = shapes.length;
const getPercentage = (count) => {
    return totalShapes > 0 ? Math.round((count / totalShapes) * 100) : 0;
};
```
### نمایش تصویری
- **نوار پیشرفت**: نمایش نسبت هر شکل
- **آیکون‌های رنگی**: مطابق با رنگ هر ابزار
- **انیمیشن hover**: تعامل بهتر با کاربر

## 🎮 استفاده

1. **انتخاب ابزار**: از نوار ابزار سمت چپ، ابزار مورد نظر را انتخاب کنید
2. **کشیدن**: ابزار را بگیرید و به سمت بوم بکشید
3. **رها کردن**: ابزار را روی بوم رها کنید
4. **مشاهده آمار**: در پنل شمارنده، تعداد و درصد اشکال را ببینید

### نکات کاربردی
- هنگام کشیدن، بوم با انیمیشن نشان‌دهنده منطقه مجاز را نمایش می‌دهد
- شمارنده به صورت زنده (real-time) به‌روزرسانی می‌شود
- روی موبایل و تبلت نیز کاملاً قابل استفاده است
