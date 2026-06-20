'use client';

import { useTheme } from 'next-themes';
import { motion } from 'framer-motion';
import {
  Home, Upload, Zap, FileText, Eye, Bot, Settings, ScrollText,
  Menu, Moon, Sun, ChevronLeft, ChevronRight, Factory,
  Video, NotebookPen, ClipboardList, Brain
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useFactoryStore, type TabType } from '@/lib/factory-store';
import HomeTab from './HomeTab';
import SourcesTab from './SourcesTab';
import ExtractionTab from './ExtractionTab';
import ContentTab from './ContentTab';
import PreviewTab from './PreviewTab';
import ModelsTab from './ModelsTab';
import SettingsTab from './SettingsTab';
import LogsTab from './LogsTab';
import VideoTab from './VideoTab';
import SummariesTab from './SummariesTab';
import ExamsTab from './ExamsTab';
import MaterialsTab from './MaterialsTab';

const navSections = [
  {
    label: 'الرئيسية',
    items: [
      { id: 'home' as TabType, label: 'لوحة التحكم', icon: <Home className="w-4 h-4" /> },
      { id: 'sources' as TabType, label: 'المصادر', icon: <Upload className="w-4 h-4" /> },
    ],
  },
  {
    label: 'العملية',
    items: [
      { id: 'extraction' as TabType, label: 'الاستخراج', icon: <Zap className="w-4 h-4" /> },
      { id: 'content' as TabType, label: 'المحتوى', icon: <FileText className="w-4 h-4" /> },
      { id: 'preview' as TabType, label: 'المعاينة', icon: <Eye className="w-4 h-4" /> },
    ],
  },
  {
    label: 'الإنتاج',
    items: [
      { id: 'video' as TabType, label: 'الفيديو', icon: <Video className="w-4 h-4" /> },
      { id: 'summaries' as TabType, label: 'الملخصات', icon: <NotebookPen className="w-4 h-4" /> },
      { id: 'exams' as TabType, label: 'الامتحانات', icon: <ClipboardList className="w-4 h-4" /> },
      { id: 'materials' as TabType, label: 'المواد المساعدة', icon: <Brain className="w-4 h-4" /> },
    ],
  },
  {
    label: 'النظام',
    items: [
      { id: 'models' as TabType, label: 'النماذج', icon: <Bot className="w-4 h-4" /> },
      { id: 'settings' as TabType, label: 'الإعدادات', icon: <Settings className="w-4 h-4" /> },
      { id: 'logs' as TabType, label: 'السجلات', icon: <ScrollText className="w-4 h-4" /> },
    ],
  },
];

function SidebarContent({ onClose }: { onClose?: () => void }) {
  const { activeTab, setActiveTab, sidebarCollapsed, toggleSidebar } = useFactoryStore();
  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-3 flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center shrink-0">
          <Factory className="w-5 h-5 text-primary-foreground" />
        </div>
        {!sidebarCollapsed && (
          <div className="min-w-0">
            <h1 className="font-bold text-sm truncate">مصنع النصوص</h1>
            <p className="text-[10px] text-muted-foreground">Book Text Factory</p>
          </div>
        )}
      </div>
      <Separator />
      <ScrollArea className="flex-1">
        <nav className="p-2 space-y-4">
          {navSections.map((section) => (
            <div key={section.label}>
              {!sidebarCollapsed && (
                <p className="px-3 text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-1">
                  {section.label}
                </p>
              )}
              <div className="space-y-0.5">
                {section.items.map((item) => {
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      title={sidebarCollapsed ? item.label : undefined}
                      onClick={() => { setActiveTab(item.id); onClose?.(); }}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 text-right ${isActive ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground hover:bg-muted'}`}
                    >
                      {item.icon}
                      {!sidebarCollapsed && <span>{item.label}</span>}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </ScrollArea>
      <Separator />
      {/* Collapse button - desktop only */}
      {!onClose && (
        <div className="p-2">
          <Button variant="ghost" size="sm" className="w-full text-xs" onClick={toggleSidebar}>
            {sidebarCollapsed ? <ChevronRight className="w-4 h-4 ml-1" /> : <ChevronLeft className="w-4 h-4 ml-1" />}
            {sidebarCollapsed ? 'توسيع' : 'تصغير'}
          </Button>
        </div>
      )}
    </div>
  );
}

function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  return (
    <Button variant="ghost" size="icon" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="shrink-0">
      <Sun className="w-4 h-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute w-4 h-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">تبديل السمة</span>
    </Button>
  );
}

export default function FactoryDashboard() {
  const { activeTab } = useFactoryStore();

  const allNavItems = navSections.flatMap(s => s.items);
  const currentTab = allNavItems.find((item) => item.id === activeTab);

  const renderTab = () => {
    switch (activeTab) {
      case 'home': return <HomeTab />;
      case 'sources': return <SourcesTab />;
      case 'extraction': return <ExtractionTab />;
      case 'content': return <ContentTab />;
      case 'preview': return <PreviewTab />;
      case 'video': return <VideoTab />;
      case 'summaries': return <SummariesTab />;
      case 'exams': return <ExamsTab />;
      case 'materials': return <MaterialsTab />;
      case 'models': return <ModelsTab />;
      case 'settings': return <SettingsTab />;
      case 'logs': return <LogsTab />;
      default: return <HomeTab />;
    }
  };

  return (
    <div dir="rtl" className="min-h-screen bg-background flex">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex border-l bg-card flex-col shrink-0 sticky top-0 h-screen transition-all duration-300">
        <SidebarContent />
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-sm border-b">
          <div className="flex items-center justify-between px-4 h-12">
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