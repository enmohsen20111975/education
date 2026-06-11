"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import { type ThemeProviderProps } from "next-themes";

/**
 * ThemeProvider Component
 * 
 * يوفر دعم الوضع الداكن/الفاتح للتطبيق باستخدام next-themes
 * 
 * الميزات:
 * - دعم الوضع الداكن والفاتح والتلقائي
 * - حفظ تفضيلات المستخدم في localStorage
 * - منع وميض الصفحة عند التحميل (Flash of Unstyled Content)
 */
export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange={false}
      {...props}
    >
      {children}
    </NextThemesProvider>
  );
}
