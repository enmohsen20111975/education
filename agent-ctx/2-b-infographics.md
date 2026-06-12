# Task 2-b: Infographics Component

## ملخص المهمة
بناء مكون Infographics تفاعلي للمنصة التعليمية يدعم 4 أنواع من المخططات.

## الملفات المنشأة
- `/home/z/my-project/src/components/Infographic.tsx` - المكون الرئيسي

## الأنواع المدعومة

### 1. مخطط المقارنة (Comparison Chart)
- أشرطة أفقية متحركة للمقارنة
- عرض قيمتين لكل عنصر
- ألوان متباينة (أخضر وبرتقالي)

### 2. مخطط العملية (Process Flow)
- خطوات متسلسلة عمودياً
- خط ربط بين الخطوات
- أيقونات قابلة للتخصيص
- تخطيط متناوب على الشاشات الكبيرة

### 3. مخطط الدائرة (Circle Diagram)
- رسم SVG تفاعلي
- أقسام ملونة بنسب مئوية
- نص مركزي قابل للتخصيص
- قائمة تسميات جانبية

### 4. الجدول الزمني (Timeline)
- أحداث متسلسلة زمنياً
- نقاط زمنية ملونة
- بطاقات للأحداث
- تخطيط شبكي متجاوب

## المميزات التقنية
- دعم RTL/LTR للغتين
- Framer Motion للحركات
- lucide-react للأيقونات
- TypeScript مع أنواع كاملة
- تصميم متجاوب (responsive)

## أمثلة جاهزة للاستخدام
- `speedComparisonData` - مقارنة السرعات
- `physicsProcessData` - خطوات حل مسألة
- `energyCircleData` - أنواع الطاقة
- `atomTimelineData` - تطور نظرية الذرة

## كيفية الاستخدام
```tsx
import { Infographic, energyCircleData } from "@/components/Infographic";

<Infographic
  type="circle"
  data={energyCircleData}
  language="ar"
  title="أنواع الطاقة"
/>
```

## حالة المهمة: ✅ مكتمل
