"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Play, Sparkles, Rocket, Star, Zap, Trophy, Users, BookOpen,
  ChevronDown, ArrowRight, Heart, Atom, Calculator, FlaskConical, Leaf,
  Globe, Moon, Sun, Brain, Quote, Instagram, Twitter, Youtube
} from "lucide-react";

// ==================== ANIMATIONS ====================
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const scaleIn = {
  hidden: { scale: 0, opacity: 0 },
  visible: { scale: 1, opacity: 1, transition: { type: "spring", stiffness: 200 } }
};

const floatAnimation = {
  animate: {
    y: [0, -10, 0],
    transition: { duration: 3, repeat: Infinity, ease: "easeInOut" }
  }
};

// ==================== MAIN COMPONENT ====================
export default function LandingPage() {
  const [lang, setLang] = useState<"ar" | "en">("ar");
  const [isDark, setIsDark] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
    const timer = setTimeout(() => setShowContent(true), 500);
    return () => clearTimeout(timer);
  }, []);

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
  };

  const t = (ar: string, en: string) => lang === "ar" ? ar : en;
  const isRTL = lang === "ar";

  // Features data
  const features = [
    { icon: Zap, title: { ar: "تعلم تفاعلي", en: "Interactive Learning" }, desc: { ar: "محاكيات ومحادثات ذكية", en: "Simulators & AI Chat" }, color: "from-purple-500 to-pink-500" },
    { icon: Trophy, title: { ar: "تحديات ومكافآت", en: "Challenges & Rewards" }, desc: { ar: "نقاط وشارات ومراكز", en: "Points, Badges & Rankings" }, color: "from-cyan-500 to-blue-500" },
    { icon: Brain, title: { ar: "ذكاء اصطناعي", en: "AI Powered" }, desc: { ar: "شرح مخصص لكل طالب", en: "Personalized explanations" }, color: "from-orange-500 to-red-500" },
    { icon: Users, title: { ar: "مجتمع نشط", en: "Active Community" }, desc: { ar: "شارك وتعلم مع أصدقائك", en: "Learn with friends" }, color: "from-green-500 to-teal-500" },
  ];

  // Subjects data
  const subjects = [
    { icon: Atom, name: { ar: "فيزياء", en: "Physics" }, lessons: 120, color: "#8B5CF6" },
    { icon: FlaskConical, name: { ar: "كيمياء", en: "Chemistry" }, lessons: 100, color: "#EC4899" },
    { icon: Calculator, name: { ar: "رياضيات", en: "Math" }, lessons: 150, color: "#F97316" },
    { icon: Leaf, name: { ar: "أحياء", en: "Biology" }, lessons: 90, color: "#10B981" },
    { icon: BookOpen, name: { ar: "عربي", en: "Arabic" }, lessons: 80, color: "#06B6D4" },
    { icon: Globe, name: { ar: "إنجليزي", en: "English" }, lessons: 85, color: "#3B82F6" },
  ];

  // Stats data
  const stats = [
    { value: "1,152+", label: { ar: "درس", en: "Lessons" } },
    { value: "54+", label: { ar: "محاكي تفاعلي", en: "Simulators" } },
    { value: "5,000+", label: { ar: "سؤال تدريبي", en: "Questions" } },
    { value: "100%", label: { ar: "منهج مصري", en: "Egyptian Curriculum" } },
  ];

  // Testimonials data
  const testimonials = [
    {
      name: "أحمد محمد",
      grade: "الصف الثالث الثانوي",
      text: { ar: "المحاكيات خلتنى أفهم الفيزياء بطريقة مختلفة تماماً! كنت بكره الفيزياء دلوقتي بنجح فيها بتفوق!", en: "The simulators made me understand physics in a totally different way! I used to hate physics, now I excel at it!" },
      avatar: "👨‍🎓",
      rating: 5
    },
    {
      name: "سارة أحمد",
      grade: "الصف الثاني الثانوي",
      text: { ar: "أخيراً منصة تعليمية مش بتوجع! بتعلم وأستمتع في نفس الوقت", en: "Finally an educational platform that doesn't hurt! I learn and have fun at the same time" },
      avatar: "👩‍🎓",
      rating: 5
    },
    {
      name: "محمد علي",
      grade: "الصف الأول الثانوي",
      text: { ar: "نظام النقاط والشارات محفز جداً! خلاني أحب المذاكرة", en: "The points and badges system is very motivating! It made me love studying" },
      avatar: "🧑‍🎓",
      rating: 5
    },
  ];

  const handleStartLearning = () => {
    setShowContent(false);
    setTimeout(() => {
      window.location.reload();
    }, 500);
  };

  return (
    <div className={`min-h-screen bg-background overflow-x-hidden ${isRTL ? "rtl" : "ltr"}`} dir={isRTL ? "rtl" : "ltr"}>
      {/* ==================== NAVBAR ==================== */}
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className="fixed top-0 left-0 right-0 z-50 glass"
      >
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <motion.div 
            className="flex items-center gap-3"
            whileHover={{ scale: 1.05 }}
          >
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <span className="font-bold text-xl bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              {t("تعلم ذكي", "SmartEdu")}
            </span>
          </motion.div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLang(lang === "ar" ? "en" : "ar")}
              className="rounded-full"
            >
              <Globe className="w-4 h-4 mr-1" />
              {lang === "ar" ? "EN" : "عربي"}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="rounded-full"
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </Button>
          </div>
        </div>
      </motion.nav>

      {/* ==================== HERO SECTION ==================== */}
      <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 gradient-hero opacity-10 animate-gradient" />
        <div className="absolute inset-0 gradient-mesh opacity-30" />
        
        {/* Floating Elements */}
        <motion.div 
          {...floatAnimation}
          className="absolute top-32 left-10 w-20 h-20 rounded-2xl gradient-primary opacity-20 blur-xl"
        />
        <motion.div 
          {...floatAnimation}
          animate={{ y: [0, 15, 0], x: [0, 5, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
          className="absolute top-40 right-20 w-16 h-16 rounded-full gradient-accent opacity-20 blur-lg"
        />
        <motion.div 
          {...floatAnimation}
          animate={{ y: [0, -20, 0], rotate: [0, 180, 360] }}
          transition={{ duration: 6, repeat: Infinity }}
          className="absolute bottom-40 left-1/4 w-12 h-12 rounded-xl gradient-success opacity-20 blur-md"
        />

        <div className="relative z-10 max-w-6xl mx-auto px-4 text-center">
          <AnimatePresence mode="wait">
            {showContent && (
              <motion.div
                initial="hidden"
                animate="visible"
                variants={staggerContainer}
                className="space-y-8"
              >
                {/* Badge */}
                <motion.div variants={fadeInUp}>
                  <Badge className="px-4 py-2 text-sm gradient-primary text-white border-0 rounded-full animate-pulse">
                    <Sparkles className="w-4 h-4 mr-2" />
                    {t("منصة تعليمية جديدة بالكامل", "A Brand New Learning Platform")}
                  </Badge>
                </motion.div>

                {/* Main Title */}
                <motion.h1 
                  variants={fadeInUp}
                  className="text-4xl md:text-6xl lg:text-7xl font-black leading-tight"
                >
                  <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 bg-clip-text text-transparent">
                    {t("تعلم بطريقتك", "Learn Your Way")}
                  </span>
                  <br />
                  <span className="text-foreground">
                    {t("استمتع وانت بتتعلم", "Have Fun Learning")}
                  </span>
                </motion.h1>

                {/* Subtitle */}
                <motion.p 
                  variants={fadeInUp}
                  className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto"
                >
                  {t(
                    "منصة تعليمية تفاعلية للمرحلة الثانوية. محاكيات، ألعاب، تحديات، وذكاء اصطناعي يساعدك تفهم أحسن.",
                    "An interactive learning platform for high school. Simulators, games, challenges, and AI to help you understand better."
                  )}
                </motion.p>

                {/* CTA Buttons */}
                <motion.div 
                  variants={fadeInUp}
                  className="flex flex-col sm:flex-row items-center justify-center gap-4"
                >
                  <Button 
                    size="lg"
                    onClick={handleStartLearning}
                    className="btn-youth px-8 py-6 text-lg text-white"
                  >
                    <Rocket className="w-5 h-5 mr-2" />
                    {t("ابدأ التعلم الآن", "Start Learning Now")}
                  </Button>
                  <Button 
                    size="lg"
                    variant="outline"
                    className="px-8 py-6 text-lg rounded-xl border-2 hover:bg-purple-500/10"
                  >
                    <Play className="w-5 h-5 mr-2" />
                    {t("شوف كيف يعمل", "See How It Works")}
                  </Button>
                </motion.div>

                {/* Scroll Indicator */}
                <motion.div 
                  variants={fadeInUp}
                  className="pt-8"
                >
                  <motion.div
                    animate={{ y: [0, 10, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="inline-flex flex-col items-center text-muted-foreground"
                  >
                    <span className="text-sm mb-2">{t("اكتشف المزيد", "Discover More")}</span>
                    <ChevronDown className="w-5 h-5" />
                  </motion.div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* ==================== STATS SECTION ==================== */}
      <section className="py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-pink-500/5 to-orange-500/5" />
        <div className="max-w-6xl mx-auto px-4">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-2 md:grid-cols-4 gap-6"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                variants={scaleIn}
                className="text-center p-6"
              >
                <div className="text-3xl md:text-4xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  {t(stat.label.ar, stat.label.en)}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ==================== FEATURES SECTION ==================== */}
      <section className="py-20 relative">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                {t("ليه تختارنا؟", "Why Choose Us?")}
              </span>
            </h2>
            <p className="text-muted-foreground text-lg">
              {t("ميزات خلت آلاف الطلاب يحبونا", "Features that made thousands of students love us")}
            </p>
          </motion.div>

          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                whileHover={{ y: -10, scale: 1.02 }}
                className="card-youth group cursor-pointer"
              >
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-r ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-lg font-bold mb-2">
                  {t(feature.title.ar, feature.title.en)}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {t(feature.desc.ar, feature.desc.en)}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ==================== SUBJECTS SECTION ==================== */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 gradient-mesh opacity-20" />
        <div className="max-w-6xl mx-auto px-4 relative z-10">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-cyan-500 to-blue-500 bg-clip-text text-transparent">
                {t("كل المواد", "All Subjects")}
              </span>
            </h2>
            <p className="text-muted-foreground text-lg">
              {t("منهج الثانوية العامة المصري بالكامل", "Complete Egyptian High School Curriculum")}
            </p>
          </motion.div>

          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4"
          >
            {subjects.map((subject, index) => (
              <motion.div
                key={index}
                variants={scaleIn}
                whileHover={{ y: -5, scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="cursor-pointer group"
              >
                <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
                  <CardContent className="p-6 text-center">
                    <motion.div 
                      className="w-16 h-16 rounded-2xl mx-auto mb-3 flex items-center justify-center"
                      style={{ backgroundColor: `${subject.color}20` }}
                      whileHover={{ rotate: [0, -10, 10, 0] }}
                      transition={{ duration: 0.5 }}
                    >
                      <subject.icon className="w-8 h-8" style={{ color: subject.color }} />
                    </motion.div>
                    <h3 className="font-bold text-sm mb-1">
                      {t(subject.name.ar, subject.name.en)}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {subject.lessons} {t("درس", "lessons")}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ==================== TESTIMONIALS SECTION ==================== */}
      <section className="py-20 relative">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">
                {t("طلابنا بيقولوا إيه؟", "What Our Students Say?")}
              </span>
            </h2>
            <p className="text-muted-foreground text-lg">
              {t("آلاف الطلاب غيروا طريقتهم في التعلم", "Thousands of students changed their learning way")}
            </p>
          </motion.div>

          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid md:grid-cols-3 gap-6"
          >
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                whileHover={{ y: -5 }}
                className="card-youth relative"
              >
                <Quote className="absolute top-4 right-4 w-8 h-8 text-purple-500/20" />
                <div className="flex items-center gap-3 mb-4">
                  <div className="text-4xl">{testimonial.avatar}</div>
                  <div>
                    <h4 className="font-bold">{testimonial.name}</h4>
                    <p className="text-xs text-muted-foreground">{testimonial.grade}</p>
                  </div>
                </div>
                <div className="flex gap-1 mb-3">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground">
                  {t(testimonial.text.ar, testimonial.text.en)}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ==================== CTA SECTION ==================== */}
      <section className="py-20 relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="relative rounded-3xl overflow-hidden"
          >
            {/* Background */}
            <div className="absolute inset-0 gradient-hero" />
            <div className="absolute inset-0 bg-black/20" />
            
            {/* Content */}
            <div className="relative z-10 p-12 md:p-16 text-center text-white">
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200 }}
                viewport={{ once: true }}
                className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm mb-6"
              >
                <Rocket className="w-10 h-10" />
              </motion.div>
              
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                {t("جاهز تبدأ رحلتك؟", "Ready to Start Your Journey?")}
              </h2>
              <p className="text-lg text-white/80 mb-8 max-w-xl mx-auto">
                {t(
                  "انضم لآلاف الطلاب اللي بيتعلموا بطريقة ممتعة. ابدأ دلوقتي مجاناً!",
                  "Join thousands of students learning in a fun way. Start now for free!"
                )}
              </p>
              
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button 
                  size="lg"
                  onClick={handleStartLearning}
                  className="bg-white text-purple-600 hover:bg-white/90 px-10 py-6 text-lg font-bold rounded-2xl shadow-2xl"
                >
                  {t("ابدأ مجاناً الآن", "Start Free Now")}
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ==================== SOCIAL SECTION ==================== */}
      <section className="py-12 border-t border-border/50">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="flex flex-col items-center gap-6"
          >
            <p className="text-muted-foreground font-medium">
              {t("تابعنا على السوشيال ميديا", "Follow us on social media")}
            </p>
            <div className="flex items-center gap-4">
              <motion.a 
                href="#" 
                whileHover={{ scale: 1.2, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
                className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white shadow-lg"
              >
                <Instagram className="w-6 h-6" />
              </motion.a>
              <motion.a 
                href="#" 
                whileHover={{ scale: 1.2, rotate: -5 }}
                whileTap={{ scale: 0.9 }}
                className="w-12 h-12 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center text-white shadow-lg"
              >
                <Twitter className="w-6 h-6" />
              </motion.a>
              <motion.a 
                href="#" 
                whileHover={{ scale: 1.2, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
                className="w-12 h-12 rounded-full bg-gradient-to-r from-red-500 to-orange-500 flex items-center justify-center text-white shadow-lg"
              >
                <Youtube className="w-6 h-6" />
              </motion.a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ==================== FOOTER ==================== */}
      <footer className="py-8 border-t border-border/50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-sm bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                {t("تعلم ذكي", "SmartEdu")}
              </span>
            </div>
            
            <p className="text-sm text-muted-foreground">
              © 2025 {t("تعلم ذكي. كل الحقوق محفوظة.", "SmartEdu. All rights reserved.")}
            </p>
            
            <div className="flex items-center gap-4">
              <motion.a 
                href="#" 
                whileHover={{ scale: 1.1, rotate: 5 }}
                className="text-muted-foreground hover:text-purple-500 transition-colors"
              >
                <Heart className="w-5 h-5" />
              </motion.a>
              <motion.a 
                href="#" 
                whileHover={{ scale: 1.1, rotate: -5 }}
                className="text-muted-foreground hover:text-pink-500 transition-colors"
              >
                <Star className="w-5 h-5" />
              </motion.a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
