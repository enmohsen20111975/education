import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/ThemeProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "تعلم ذكي | SmartEdu - منصة تعليمية تفاعلية للثانوية العامة",
  description: "منصة تعليمية تفاعلية للمرحلة الثانوية المصرية. محاكيات، ألعاب، تحديات، وذكاء اصطناعي. تعلم فيزياء، كيمياء، رياضيات، أحياء بطريقة ممتعة!",
  keywords: ["تعليم", "ثانوية عامة", "مصر", "فيزياء", "كيمياء", "رياضيات", "أحياء", "تعلم تفاعلي", "محاكيات", "ذكاء اصطناعي"],
  authors: [{ name: "SmartEdu Team" }],
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "تعلم ذكي | SmartEdu",
    description: "منصة تعليمية تفاعلية للثانوية العامة المصرية",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "تعلم ذكي | SmartEdu",
    description: "منصة تعليمية تفاعلية للثانوية العامة المصرية",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange={false}
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
