'use client';

import { useTheme } from 'next-themes';
import { motion } from 'framer-motion';
import {
  BookOpen, Zap, Bot, FileText, Menu, Moon, Sun, Settings
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useFactoryStore, type TabType } from '@/lib/factory-store';
import BooksTab from './BooksTab';
import ExtractionTab from './ExtractionTab';
import ModelsTab from './ModelsTab';
import ContentTab from './ContentTab';

const navItems: { id: TabType; label: string; icon: React.ReactNode }[] = [
  { id: 'books', label: 'الكتب', icon: <BookOpen className="w-5 h-5" /> },
  { id: 'extraction', label: 'الاستخراج', icon: <Zap className="w-5 h-5" /> },
  { id: 'models', label: 'النماذج', icon: <Bot className="w-5 h-5" /> },
  { id: 'content', label: 'المحتوى', icon: <FileText className="w-5 h-5" /> },
];

function SidebarContent({ onClose }: { onClose?: () => void }) {
  const { activeTab, setActiveTab } = useFactoryStore();

  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-4 flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
          <Settings className="w-5 h-5 text-primary-foreground" />
        </div>
        <div>
          <h1 className="font-bold text-sm">مصنع النصوص</h1>
          <p className="text-[10px] text-muted-foreground">Book Text Factory</p>
        </div>
      </div>

      <Separator />

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                onClose?.();
              }}
              className={`
                w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
                transition-all duration-200 text-right
                ${isActive
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }
              `}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      <Separator />

      {/* Footer */}
      <div className="p-4">
        <p className="text-[10px] text-muted-foreground text-center">
          الإصدار 1.0.0
        </p>
      </div>
    </div>
  );
}

function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="shrink-0"
    >
      <Sun className="w-4 h-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute w-4 h-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">تبديل السمة</span>
    </Button>
  );
}

export default function FactoryDashboard() {
  const { activeTab } = useFactoryStore();

  const renderTab = () => {
    switch (activeTab) {
      case 'books':
        return <BooksTab />;
      case 'extraction':
        return <ExtractionTab />;
      case 'models':
        return <ModelsTab />;
      case 'content':
        return <ContentTab />;
      default:
        return <BooksTab />;
    }
  };

  const currentTab = navItems.find((item) => item.id === activeTab);

  return (
    <div dir="rtl" className="min-h-screen bg-background flex">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-60 border-l bg-card flex-col shrink-0 sticky top-0 h-screen">
        <SidebarContent />
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-sm border-b">
          <div className="flex items-center justify-between px-4 h-14">
            {/* Mobile Menu + Tab Title */}
            <div className="flex items-center gap-3">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="md:hidden">
                    <Menu className="w-5 h-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-60 p-0">
                  <SheetTitle className="sr-only">القائمة</SheetTitle>
                  <SidebarContent />
                </SheetContent>
              </Sheet>

              <div className="flex items-center gap-2">
                <div className="text-primary">{currentTab?.icon}</div>
                <h2 className="font-semibold text-sm">{currentTab?.label}</h2>
              </div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-2">
              <ThemeToggle />
            </div>
          </div>
        </header>

        {/* Tab Content */}
        <div className="flex-1 p-4 md:p-6 overflow-auto">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            {renderTab()}
          </motion.div>
        </div>
      </main>
    </div>
  );
}