"use client";

import { useTheme } from "next-themes";
import { useSyncExternalStore, useCallback } from "react";
import { Moon, Sun, Monitor } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

/**
 * Custom hook للتحقق من أن المكون تم تحميله على العميل
 * يستخدم useSyncExternalStore بدلاً من useEffect لتجنب مشاكل ESLint
 */
function useMounted() {
  const subscribe = useCallback(() => () => {}, []);
  const getSnapshot = useCallback(() => true, []);
  const getServerSnapshot = useCallback(() => false, []);
  
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

/**
 * ThemeToggle Component
 * 
 * زر تبديل الوضع الداكن/الفاتح مع:
 * - أيقونة شمس/قمر متحركة
 * - Tooltip يوضح الوضع الحالي
 * - قائمة خيارات للوضع الداكن/الفاتح/التلقائي
 */
export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const mounted = useMounted();

  // لا تعرض شيئاً حتى يتم تحميل المكون على العميل
  // هذا يمنع خطأ عدم تطابق الـ hydration
  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" className="h-9 w-9">
        <div className="h-5 w-5" />
      </Button>
    );
  }

  const themeLabels: Record<string, { ar: string; en: string }> = {
    light: { ar: "الوضع الفاتح", en: "Light Mode" },
    dark: { ar: "الوضع الداكن", en: "Dark Mode" },
    system: { ar: "تلقائي (النظام)", en: "System" },
  };

  const currentTheme = theme || "system";
  const isDark = resolvedTheme === "dark";

  return (
    <TooltipProvider delayDuration={300}>
      <DropdownMenu>
        <Tooltip>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger asChild>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative h-9 w-9 rounded-md flex items-center justify-center hover:bg-accent hover:text-accent-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background"
                aria-label="تبديل الوضع"
              >
                <AnimatePresence mode="wait" initial={false}>
                  {isDark ? (
                    <motion.div
                      key="moon"
                      initial={{ rotate: -90, opacity: 0, scale: 0 }}
                      animate={{ rotate: 0, opacity: 1, scale: 1 }}
                      exit={{ rotate: 90, opacity: 0, scale: 0 }}
                      transition={{ duration: 0.2, ease: "easeInOut" }}
                    >
                      <Moon className="h-5 w-5 text-yellow-400" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="sun"
                      initial={{ rotate: 90, opacity: 0, scale: 0 }}
                      animate={{ rotate: 0, opacity: 1, scale: 1 }}
                      exit={{ rotate: -90, opacity: 0, scale: 0 }}
                      transition={{ duration: 0.2, ease: "easeInOut" }}
                    >
                      <Sun className="h-5 w-5 text-orange-500" />
                    </motion.div>
                  )}
                </AnimatePresence>
                <span className="sr-only">تبديل الوضع</span>
              </motion.button>
            </DropdownMenuTrigger>
          </TooltipTrigger>
          <TooltipContent side="bottom" className="font-medium">
            <p>{themeLabels[currentTheme]?.ar || currentTheme}</p>
          </TooltipContent>
        </Tooltip>
        <DropdownMenuContent align="end" className="w-40">
          <DropdownMenuItem
            onClick={() => setTheme("light")}
            className="flex items-center gap-2 cursor-pointer"
          >
            <Sun className="h-4 w-4 text-orange-500" />
            <span>الوضع الفاتح</span>
            {currentTheme === "light" && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="mr-auto h-2 w-2 rounded-full bg-primary"
              />
            )}
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setTheme("dark")}
            className="flex items-center gap-2 cursor-pointer"
          >
            <Moon className="h-4 w-4 text-yellow-400" />
            <span>الوضع الداكن</span>
            {currentTheme === "dark" && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="mr-auto h-2 w-2 rounded-full bg-primary"
              />
            )}
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setTheme("system")}
            className="flex items-center gap-2 cursor-pointer"
          >
            <Monitor className="h-4 w-4" />
            <span>تلقائي</span>
            {currentTheme === "system" && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="mr-auto h-2 w-2 rounded-full bg-primary"
              />
            )}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </TooltipProvider>
  );
}

/**
 * ThemeToggleSimple Component
 * 
 * نسخة مبسطة من زر التبديل - يتبدل بين الداكن والفاتح فقط
 */
export function ThemeToggleSimple() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const mounted = useMounted();

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" className="h-9 w-9">
        <div className="h-5 w-5" />
      </Button>
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <TooltipProvider delayDuration={300}>
      <Tooltip>
        <TooltipTrigger asChild>
          <motion.button
            whileHover={{ scale: 1.1, rotate: 15 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setTheme(isDark ? "light" : "dark")}
            className="relative h-9 w-9 rounded-md flex items-center justify-center hover:bg-accent hover:text-accent-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background"
            aria-label={isDark ? "التبديل إلى الوضع الفاتح" : "التبديل إلى الوضع الداكن"}
          >
            <AnimatePresence mode="wait" initial={false}>
              {isDark ? (
                <motion.div
                  key="sun"
                  initial={{ rotate: -90, opacity: 0, scale: 0 }}
                  animate={{ rotate: 0, opacity: 1, scale: 1 }}
                  exit={{ rotate: 90, opacity: 0, scale: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                  <Sun className="h-5 w-5 text-yellow-400" />
                </motion.div>
              ) : (
                <motion.div
                  key="moon"
                  initial={{ rotate: 90, opacity: 0, scale: 0 }}
                  animate={{ rotate: 0, opacity: 1, scale: 1 }}
                  exit={{ rotate: -90, opacity: 0, scale: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                  <Moon className="h-5 w-5 text-slate-700" />
                </motion.div>
              )}
            </AnimatePresence>
            <span className="sr-only">
              {isDark ? "التبديل إلى الوضع الفاتح" : "التبديل إلى الوضع الداكن"}
            </span>
          </motion.button>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          <p>{isDark ? "الوضع الفاتح" : "الوضع الداكن"}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
