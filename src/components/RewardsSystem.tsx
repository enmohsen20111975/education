"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  BookOpen,
  Atom,
  Calculator,
  Beaker,
  Zap,
  Flame,
  Award,
  Trophy,
  Star,
  Crown,
  Target,
  Sparkles,
  Check,
  Lock,
} from "lucide-react";

// ===== أنواع البيانات =====
export interface BadgeData {
  id: string;
  name: string;
  nameAr: string;
  description: string;
  descriptionAr: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  gradient: string;
  requirement: number;
  type: "lessons" | "subject" | "simulator" | "streak";
  subject?: string;
  tier: "bronze" | "silver" | "gold";
}

export interface Level {
  id: string;
  name: string;
  nameAr: string;
  minPoints: number;
  maxPoints: number;
  color: string;
  gradient: string;
  icon: React.ComponentType<{ className?: string }>;
}

export interface UserProgress {
  totalPoints: number;
  completedLessons: number;
  physicsLessons: number;
  mathLessons: number;
  chemistryLessons: number;
  simulatorsUsed: number;
  streakDays: number;
  earnedBadges: string[];
}

// ===== تعريف الشارات =====
export const BADGES: BadgeData[] = [
  {
    id: "active-learner",
    name: "Active Learner",
    nameAr: "المتعلم النشط",
    description: "Complete 5 lessons",
    descriptionAr: "أكمل 5 دروس",
    icon: BookOpen,
    color: "#10b981",
    gradient: "from-emerald-400 to-teal-500",
    requirement: 5,
    type: "lessons",
    tier: "bronze",
  },
  {
    id: "physics-expert",
    name: "Physics Expert",
    nameAr: "خبير الفيزياء",
    description: "Complete 5 physics lessons",
    descriptionAr: "أكمل 5 دروس فيزياء",
    icon: Atom,
    color: "#06b6d4",
    gradient: "from-cyan-400 to-blue-500",
    requirement: 5,
    type: "subject",
    subject: "physics",
    tier: "silver",
  },
  {
    id: "math-wizard",
    name: "Math Wizard",
    nameAr: "عالم الرياضيات",
    description: "Complete 5 math lessons",
    descriptionAr: "أكمل 5 دروس رياضيات",
    icon: Calculator,
    color: "#3b82f6",
    gradient: "from-blue-400 to-indigo-500",
    requirement: 5,
    type: "subject",
    subject: "math",
    tier: "silver",
  },
  {
    id: "chemistry-creator",
    name: "Chemistry Creator",
    nameAr: "الكيميائي المبدع",
    description: "Complete 5 chemistry lessons",
    descriptionAr: "أكمل 5 دروس كيمياء",
    icon: Beaker,
    color: "#a855f7",
    gradient: "from-purple-400 to-pink-500",
    requirement: 5,
    type: "subject",
    subject: "chemistry",
    tier: "silver",
  },
  {
    id: "simulator-pro",
    name: "Simulator Pro",
    nameAr: "المحاكي المحترف",
    description: "Use 5 simulators",
    descriptionAr: "استخدم 5 محاكيات",
    icon: Zap,
    color: "#f59e0b",
    gradient: "from-amber-400 to-orange-500",
    requirement: 5,
    type: "simulator",
    tier: "gold",
  },
  {
    id: "persistent",
    name: "Persistent",
    nameAr: "المثابر",
    description: "Study for 7 consecutive days",
    descriptionAr: "دراسة متواصلة 7 أيام",
    icon: Flame,
    color: "#ef4444",
    gradient: "from-red-400 to-rose-500",
    requirement: 7,
    type: "streak",
    tier: "gold",
  },
];

// ===== تعريف المستويات =====
export const LEVELS: Level[] = [
  {
    id: "beginner",
    name: "Beginner",
    nameAr: "المبتدئ",
    minPoints: 0,
    maxPoints: 100,
    color: "#6b7280",
    gradient: "from-gray-400 to-gray-500",
    icon: Star,
  },
  {
    id: "learner",
    name: "Learner",
    nameAr: "المتعلم",
    minPoints: 101,
    maxPoints: 300,
    color: "#10b981",
    gradient: "from-emerald-400 to-teal-500",
    icon: Target,
  },
  {
    id: "advanced",
    name: "Advanced",
    nameAr: "المتقدم",
    minPoints: 301,
    maxPoints: 600,
    color: "#3b82f6",
    gradient: "from-blue-400 to-cyan-500",
    icon: Award,
  },
  {
    id: "expert",
    name: "Expert",
    nameAr: "الخبير",
    minPoints: 601,
    maxPoints: 1000,
    color: "#a855f7",
    gradient: "from-purple-400 to-pink-500",
    icon: Trophy,
  },
  {
    id: "master",
    name: "Master",
    nameAr: "المعلم",
    minPoints: 1001,
    maxPoints: Infinity,
    color: "#f59e0b",
    gradient: "from-amber-400 to-yellow-500",
    icon: Crown,
  },
];

// ===== دوال مساعدة =====
export function calculatePoints(progress: UserProgress): number {
  let points = 0;
  points += progress.completedLessons * 10; // 10 نقاط لكل درس
  points += progress.simulatorsUsed * 5; // 5 نقاط لكل محاكي
  points += progress.earnedBadges.length * 50; // 50 نقطة bonus لكل شارة
  return points;
}

export function getCurrentLevel(points: number): Level {
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (points >= LEVELS[i].minPoints) {
      return LEVELS[i];
    }
  }
  return LEVELS[0];
}

export function getProgressToNextLevel(points: number): { current: number; required: number; percentage: number } {
  const currentLevel = getCurrentLevel(points);
  const currentLevelIndex = LEVELS.findIndex((l) => l.id === currentLevel.id);
  const nextLevel = LEVELS[currentLevelIndex + 1];

  if (!nextLevel) {
    return { current: points - currentLevel.minPoints, required: 0, percentage: 100 };
  }

  const current = points - currentLevel.minPoints;
  const required = nextLevel.minPoints - currentLevel.minPoints;
  const percentage = Math.min((current / required) * 100, 100);

  return { current, required, percentage };
}

export function checkBadgeEarned(badge: BadgeData, progress: UserProgress): boolean {
  switch (badge.type) {
    case "lessons":
      return progress.completedLessons >= badge.requirement;
    case "subject":
      if (badge.subject === "physics") return progress.physicsLessons >= badge.requirement;
      if (badge.subject === "math") return progress.mathLessons >= badge.requirement;
      if (badge.subject === "chemistry") return progress.chemistryLessons >= badge.requirement;
      return false;
    case "simulator":
      return progress.simulatorsUsed >= badge.requirement;
    case "streak":
      return progress.streakDays >= badge.requirement;
    default:
      return false;
  }
}

export function getBadgeProgress(badge: BadgeData, progress: UserProgress): number {
  let current = 0;
  switch (badge.type) {
    case "lessons":
      current = progress.completedLessons;
      break;
    case "subject":
      if (badge.subject === "physics") current = progress.physicsLessons;
      if (badge.subject === "math") current = progress.mathLessons;
      if (badge.subject === "chemistry") current = progress.chemistryLessons;
      break;
    case "simulator":
      current = progress.simulatorsUsed;
      break;
    case "streak":
      current = progress.streakDays;
      break;
  }
  return Math.min((current / badge.requirement) * 100, 100);
}

// ===== مكون بطاقة الشارة =====
function BadgeCard({
  badge,
  isEarned,
  progress,
  language,
  showAnimation,
}: {
  badge: BadgeData;
  isEarned: boolean;
  progress: number;
  language: "ar" | "en";
  showAnimation?: boolean;
}) {
  const Icon = badge.icon;
  const tierColors = {
    bronze: {
      bg: "from-amber-600 to-orange-700",
      ring: "ring-amber-500/50",
      glow: "shadow-amber-500/30",
    },
    silver: {
      bg: "from-slate-300 to-slate-500",
      ring: "ring-slate-400/50",
      glow: "shadow-slate-400/30",
    },
    gold: {
      bg: "from-yellow-400 to-amber-500",
      ring: "ring-yellow-500/50",
      glow: "shadow-yellow-500/50",
    },
  };

  const tier = tierColors[badge.tier];

  return (
    <motion.div
      className="relative"
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5, type: "spring" }}
      whileHover={{ scale: 1.05, y: -5 }}
    >
      {/* الشارة */}
      <div
        className={`relative w-20 h-20 rounded-full flex items-center justify-center
        ${isEarned ? `bg-gradient-to-br ${tier.bg}` : "bg-slate-200 dark:bg-slate-700"}
        ${isEarned ? `ring-4 ${tier.ring} shadow-lg ${tier.glow}` : ""}
        transition-all duration-300`}
      >
        {/* أنيميشن اللمعان للشارات المكتسبة */}
        {isEarned && (
          <motion.div
            className="absolute inset-0 rounded-full bg-gradient-to-tr from-white/0 via-white/30 to-white/0"
            animate={{
              rotate: [0, 360],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        )}

        {/* الأيقونة */}
        <Icon
          className={`w-8 h-8 relative z-10 ${
            isEarned ? "text-white" : "text-slate-400 dark:text-slate-500"
          }`}
        />

        {/* علامة القفل للشارات غير المكتسبة */}
        {!isEarned && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-full">
            <Lock className="w-6 h-6 text-slate-500 dark:text-slate-400" />
          </div>
        )}

        {/* علامة التحقق للشارات المكتسبة */}
        {isEarned && (
          <motion.div
            className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center shadow-lg"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring" }}
          >
            <Check className="w-4 h-4 text-white" />
          </motion.div>
        )}

        {/* أنيميشن الحصول على شارة جديدة */}
        {showAnimation && isEarned && (
          <>
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 rounded-full bg-yellow-400"
                initial={{ scale: 0, x: 0, y: 0 }}
                animate={{
                  scale: [0, 1, 0],
                  x: Math.cos((i * Math.PI * 2) / 8) * 50,
                  y: Math.sin((i * Math.PI * 2) / 8) * 50,
                }}
                transition={{
                  duration: 1,
                  delay: i * 0.1,
                }}
              />
            ))}
          </>
        )}
      </div>

      {/* اسم الشارة */}
      <p
        className={`text-center mt-2 text-sm font-medium ${
          isEarned ? "text-slate-700 dark:text-slate-300" : "text-slate-400 dark:text-slate-500"
        }`}
      >
        {language === "ar" ? badge.nameAr : badge.name}
      </p>

      {/* شريط التقدم للشارات غير المكتسبة */}
      {!isEarned && (
        <div className="mt-1 w-full px-1">
          <div className="h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
            <motion.div
              className={`h-full bg-gradient-to-r ${badge.gradient} rounded-full`}
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1, delay: 0.5 }}
            />
          </div>
          <p className="text-xs text-slate-400 dark:text-slate-500 text-center mt-1">
            {Math.round(progress)}%
          </p>
        </div>
      )}
    </motion.div>
  );
}

// ===== مكون شريط الإنجازات =====
export function AchievementBar({
  progress,
  language = "ar",
}: {
  progress: UserProgress;
  language?: "ar" | "en";
}) {
  const points = calculatePoints(progress);
  const currentLevel = getCurrentLevel(points);
  const levelProgress = getProgressToNextLevel(points);
  const earnedBadges = BADGES.filter((badge) =>
    progress.earnedBadges.includes(badge.id)
  );

  const LevelIcon = currentLevel.icon;

  return (
    <Card className="overflow-hidden border-0 shadow-lg bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-800">
      {/* شريط ملون علوي */}
      <div className={`h-1 bg-gradient-to-r ${currentLevel.gradient}`} />

      <CardContent className="p-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          {/* المستوى */}
          <motion.div
            className={`flex items-center gap-3 p-3 rounded-xl bg-gradient-to-br ${currentLevel.gradient} shadow-lg`}
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <LevelIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-white/80 text-xs">
                {language === "ar" ? "المستوى" : "Level"}
              </p>
              <p className="text-white font-bold text-lg">
                {language === "ar" ? currentLevel.nameAr : currentLevel.name}
              </p>
            </div>
          </motion.div>

          {/* النقاط والتقدم */}
          <div className="flex-1 w-full">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-500" />
                <span className="font-bold text-xl text-slate-700 dark:text-slate-300">
                  {points}
                </span>
                <span className="text-slate-500 dark:text-slate-400 text-sm">
                  {language === "ar" ? "نقطة" : "points"}
                </span>
              </div>
              <span className="text-sm text-slate-500 dark:text-slate-400">
                {levelProgress.required > 0
                  ? `${levelProgress.current}/${levelProgress.required} ${
                      language === "ar" ? "للمستوى التالي" : "to next level"
                    }`
                  : language === "ar"
                  ? "الحد الأقصى!"
                  : "Max level!"}
              </span>
            </div>

            <div className="relative h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
              <motion.div
                className={`absolute inset-y-0 left-0 bg-gradient-to-r ${currentLevel.gradient} rounded-full`}
                initial={{ width: 0 }}
                animate={{ width: `${levelProgress.percentage}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
              {/* تأثير اللمعان */}
              <motion.div
                className="absolute inset-y-0 w-20 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                animate={{ x: ["-100%", "400%"] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
              />
            </div>
          </div>

          {/* الشارات المكتسبة */}
          <div className="flex items-center gap-2">
            <div className="flex -space-x-2">
              {earnedBadges.slice(0, 3).map((badge, index) => {
                const Icon = badge.icon;
                return (
                  <motion.div
                    key={badge.id}
                    className={`w-8 h-8 rounded-full bg-gradient-to-br ${badge.gradient} flex items-center justify-center ring-2 ring-white dark:ring-slate-800`}
                    initial={{ scale: 0, x: 20 }}
                    animate={{ scale: 1, x: 0 }}
                    transition={{ delay: 0.1 * index, type: "spring" }}
                    whileHover={{ scale: 1.1, zIndex: 10 }}
                  >
                    <Icon className="w-4 h-4 text-white" />
                  </motion.div>
                );
              })}
              {earnedBadges.length > 3 && (
                <motion.div
                  className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center ring-2 ring-white dark:ring-slate-800 text-xs font-bold text-slate-600 dark:text-slate-300"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  +{earnedBadges.length - 3}
                </motion.div>
              )}
            </div>
            <Badge variant="secondary" className="ml-2">
              {earnedBadges.length}/{BADGES.length}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ===== مكون عرض الشارات =====
export function BadgesDisplay({
  progress,
  language = "ar",
}: {
  progress: UserProgress;
  language?: "ar" | "en";
}) {
  return (
    <Card className="overflow-hidden border-0 shadow-lg bg-white dark:bg-slate-900">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Award className="w-5 h-5 text-amber-500" />
          {language === "ar" ? "الشارات والإنجازات" : "Badges & Achievements"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-4">
          {BADGES.map((badge, index) => {
            const isEarned = progress.earnedBadges.includes(badge.id);
            const badgeProgress = getBadgeProgress(badge, progress);

            return (
              <motion.div
                key={badge.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <BadgeCard
                  badge={badge}
                  isEarned={isEarned}
                  progress={badgeProgress}
                  language={language}
                />
              </motion.div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

// ===== مكون نظام المكافآت الكامل =====
export function RewardsSystem({
  progress,
  language = "ar",
}: {
  progress: UserProgress;
  language?: "ar" | "en";
}) {
  return (
    <div className="space-y-4">
      <AchievementBar progress={progress} language={language} />
      <BadgesDisplay progress={progress} language={language} />
    </div>
  );
}

// ===== مكون نافذة الشارة الجديدة =====
export function NewBadgeModal({
  badge,
  isOpen,
  onClose,
  language = "ar",
}: {
  badge: BadgeData;
  isOpen: boolean;
  onClose: () => void;
  language?: "ar" | "en";
}) {
  const Icon = badge.icon;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-2xl max-w-sm mx-4 text-center"
            initial={{ scale: 0, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 10 }}
            transition={{ type: "spring", damping: 15 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* أنيميشن الاحتفال */}
            <div className="absolute inset-0 pointer-events-none">
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-3 h-3 rounded-full"
                  style={{
                    backgroundColor: ["#f59e0b", "#10b981", "#3b82f6", "#a855f7", "#ef4444"][
                      i % 5
                    ],
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                  }}
                  initial={{ scale: 0, opacity: 1 }}
                  animate={{
                    scale: [0, 1, 0],
                    opacity: [1, 1, 0],
                    y: [0, -100 - Math.random() * 100],
                  }}
                  transition={{
                    duration: 1.5,
                    delay: i * 0.05,
                  }}
                />
              ))}
            </div>

            {/* الشارة */}
            <motion.div
              className={`w-24 h-24 mx-auto rounded-full bg-gradient-to-br ${badge.gradient} flex items-center justify-center shadow-xl`}
              animate={{
                boxShadow: [
                  "0 0 0 0 rgba(245, 158, 11, 0.4)",
                  "0 0 0 30px rgba(245, 158, 11, 0)",
                ],
              }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <Icon className="w-12 h-12 text-white" />
            </motion.div>

            <h3 className="mt-6 text-2xl font-bold text-slate-800 dark:text-white">
              {language === "ar" ? "شارة جديدة!" : "New Badge!"}
            </h3>
            <p className="mt-2 text-lg font-semibold text-amber-600 dark:text-amber-400">
              {language === "ar" ? badge.nameAr : badge.name}
            </p>
            <p className="mt-2 text-slate-500 dark:text-slate-400">
              {language === "ar" ? badge.descriptionAr : badge.description}
            </p>

            <div className="mt-4 flex items-center justify-center gap-2 text-amber-500">
              <Sparkles className="w-5 h-5" />
              <span className="font-bold">+50</span>
              <span className="text-sm">
                {language === "ar" ? "نقطة" : "points"}
              </span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ===== مثال على بيانات المستخدم =====
export const mockUserProgress: UserProgress = {
  totalPoints: 0,
  completedLessons: 3,
  physicsLessons: 2,
  mathLessons: 1,
  chemistryLessons: 0,
  simulatorsUsed: 2,
  streakDays: 3,
  earnedBadges: [],
};

// ===== Hook لإدارة نظام المكافآت =====
export function useRewards(initialProgress?: UserProgress) {
  const [progress, setProgress] = useState<UserProgress>(
    initialProgress || mockUserProgress
  );
  const [newBadge, setNewBadge] = useState<BadgeData | null>(null);

  // تحديث التقدم والتحقق من الشارات الجديدة
  const updateProgress = (updates: Partial<UserProgress>) => {
    setProgress((prev) => {
      const newProgress = { ...prev, ...updates };
      const newPoints = calculatePoints(newProgress);

      // التحقق من الشارات الجديدة
      BADGES.forEach((badge) => {
        if (
          !prev.earnedBadges.includes(badge.id) &&
          checkBadgeEarned(badge, newProgress)
        ) {
          setNewBadge(badge);
          newProgress.earnedBadges = [...newProgress.earnedBadges, badge.id];
        }
      });

      newProgress.totalPoints = newPoints;
      return newProgress;
    });
  };

  const closeBadgeModal = () => setNewBadge(null);

  return {
    progress,
    updateProgress,
    newBadge,
    closeBadgeModal,
    points: calculatePoints(progress),
    level: getCurrentLevel(calculatePoints(progress)),
  };
}

export default RewardsSystem;
