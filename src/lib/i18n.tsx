"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type Language = "ar" | "en";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  dir: "rtl" | "ltr";
}

const translations: Record<Language, Record<string, string>> = {
  ar: {
    // Navigation
    "nav.home": "الرئيسية",
    "nav.lessons": "الدروس",
    "nav.simulators": "المحاكيات",
    "nav.profile": "الملف الشخصي",
    
    // Dashboard
    "dashboard.welcome": "مرحباً بك في منصة ثانوية تفاعلية",
    "dashboard.subtitle": "تعلم الفيزياء بطريقة تفاعلية وممتعة",
    "dashboard.progress": "تقدمك",
    "dashboard.completedLessons": "الدروس المكتملة",
    "dashboard.totalScore": "مجموع درجاتك",
    "dashboard.continue": "استمر في التعلم",
    
    // Lessons
    "lessons.title": "قائمة الدروس",
    "lessons.unit": "الوحدة",
    "lessons.duration": "دقيقة",
    "lessons.free": "مجاني",
    "lessons.premium": "مدفوع",
    "lessons.locked": "مقفل",
    "lessons.startLesson": "ابدأ الدرس",
    "lessons.continueLesson": "استكمل الدرس",
    "lessons.completed": "مكتمل",
    "lessons.score": "الدرجة",
    
    // Units
    "unit.mechanics": "الميكانيكا",
    "unit.forces": "القوى",
    "unit.energy": "الطاقة",
    
    // Simulators
    "simulators.title": "المحاكيات التفاعلية",
    "simulators.motion": "محاكي الحركة",
    "simulators.motionDesc": "استكشف السرعة والتسارع بشكل تفاعلي",
    "simulators.forces": "محاكي القوى",
    "simulators.forcesDesc": "تعلم توازن القوى بالتجربة",
    "simulators.energy": "محاكي الطاقة",
    "simulators.energyDesc": "شاهد تحولات الطاقة",
    "simulators.freeFall": "محاكي السقوط الحر",
    "simulators.freeFallDesc": "استكشف حركة الأجسام تحت تأثير الجاذبية",
    "simulators.projectile": "محاكي الرمي الأفقي",
    "simulators.projectileDesc": "استكشف مسار المقذوفات والمدى الأفقي",
    "simulators.wave": "محاكي الموجات",
    "simulators.waveDesc": "استكشف أنواع الموجات وخصائصها",
    "simulators.functions": "محاكي الدوال",
    "simulators.functionsDesc": "استكشف الدوال الرياضية ورسومها",
    "simulators.periodicTable": "الجدول الدوري",
    "simulators.periodicTableDesc": "استكشف العناصر الكيميائية",
    "simulators.open": "افتح المحاكي",
    
    // Quiz
    "quiz.title": "اختبار الدرس",
    "quiz.question": "سؤال",
    "quiz.submit": "إرسال الإجابات",
    "quiz.next": "السؤال التالي",
    "quiz.previous": "السؤال السابق",
    "quiz.result": "نتيجتك",
    "quiz.correct": "صحيح!",
    "quiz.incorrect": "خطأ!",
    "quiz.tryAgain": "حاول مرة أخرى",
    
    // Auth
    "auth.login": "تسجيل الدخول",
    "auth.register": "إنشاء حساب",
    "auth.email": "البريد الإلكتروني",
    "auth.password": "كلمة المرور",
    "auth.name": "الاسم",
    "auth.logout": "تسجيل الخروج",
    "auth.noAccount": "ليس لديك حساب؟",
    "auth.hasAccount": "لديك حساب بالفعل؟",
    
    // Subscription
    "subscription.free": "مجاني",
    "subscription.premium": "مدفوع",
    "subscription.upgrade": "ترقية الاشتراك",
    "subscription.unlockAll": "افتح جميع الدروس",
    
    // Footer
    "footer.rights": "جميع الحقوق محفوظة",
    
    // Misc
    "loading": "جاري التحميل...",
    "error": "حدث خطأ",
    "success": "تم بنجاح",
  },
  en: {
    // Navigation
    "nav.home": "Home",
    "nav.lessons": "Lessons",
    "nav.simulators": "Simulators",
    "nav.profile": "Profile",
    
    // Dashboard
    "dashboard.welcome": "Welcome to Interactive High School",
    "dashboard.subtitle": "Learn Physics in an interactive and fun way",
    "dashboard.progress": "Your Progress",
    "dashboard.completedLessons": "Completed Lessons",
    "dashboard.totalScore": "Total Score",
    "dashboard.continue": "Continue Learning",
    
    // Lessons
    "lessons.title": "Lessons List",
    "lessons.unit": "Unit",
    "lessons.duration": "min",
    "lessons.free": "Free",
    "lessons.premium": "Premium",
    "lessons.locked": "Locked",
    "lessons.startLesson": "Start Lesson",
    "lessons.continueLesson": "Continue Lesson",
    "lessons.completed": "Completed",
    "lessons.score": "Score",
    
    // Units
    "unit.mechanics": "Mechanics",
    "unit.forces": "Forces",
    "unit.energy": "Energy",
    
    // Simulators
    "simulators.title": "Interactive Simulators",
    "simulators.motion": "Motion Simulator",
    "simulators.motionDesc": "Explore velocity and acceleration interactively",
    "simulators.forces": "Forces Simulator",
    "simulators.forcesDesc": "Learn force balance through experiments",
    "simulators.energy": "Energy Simulator",
    "simulators.energyDesc": "Watch energy transformations",
    "simulators.freeFall": "Free Fall Simulator",
    "simulators.freeFallDesc": "Explore objects motion under gravity",
    "simulators.projectile": "Projectile Motion",
    "simulators.projectileDesc": "Explore projectile trajectory and range",
    "simulators.wave": "Wave Simulator",
    "simulators.waveDesc": "Explore wave types and properties",
    "simulators.functions": "Functions Simulator",
    "simulators.functionsDesc": "Explore mathematical functions and graphs",
    "simulators.periodicTable": "Periodic Table",
    "simulators.periodicTableDesc": "Explore chemical elements",
    "simulators.open": "Open Simulator",
    
    // Quiz
    "quiz.title": "Lesson Quiz",
    "quiz.question": "Question",
    "quiz.submit": "Submit Answers",
    "quiz.next": "Next Question",
    "quiz.previous": "Previous Question",
    "quiz.result": "Your Result",
    "quiz.correct": "Correct!",
    "quiz.incorrect": "Incorrect!",
    "quiz.tryAgain": "Try Again",
    
    // Auth
    "auth.login": "Login",
    "auth.register": "Register",
    "auth.email": "Email",
    "auth.password": "Password",
    "auth.name": "Name",
    "auth.logout": "Logout",
    "auth.noAccount": "Don't have an account?",
    "auth.hasAccount": "Already have an account?",
    
    // Subscription
    "subscription.free": "Free",
    "subscription.premium": "Premium",
    "subscription.upgrade": "Upgrade Subscription",
    "subscription.unlockAll": "Unlock All Lessons",
    
    // Footer
    "footer.rights": "All Rights Reserved",
    
    // Misc
    "loading": "Loading...",
    "error": "An error occurred",
    "success": "Success",
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Helper function to get initial language
function getInitialLanguage(): Language {
  if (typeof window === "undefined") return "ar";
  const saved = localStorage.getItem("language") as Language;
  if (saved && (saved === "ar" || saved === "en")) {
    return saved;
  }
  return "ar";
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("ar");

  // Use useLayoutEffect to set initial language on client
  useEffect(() => {
    const initial = getInitialLanguage();
    if (initial !== language) {
      setLanguageState(initial);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSetLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("language", lang);
    // Update document direction
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = lang;
  };

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  const dir = language === "ar" ? "rtl" : "ltr";

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t, dir }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
