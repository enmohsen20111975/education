import { create } from 'zustand';

export type TabType = 'home' | 'sources' | 'extraction' | 'content' | 'preview' | 'models' | 'settings' | 'logs';

export interface Book {
  id: string;
  title: string;
  fileName: string;
  fileSize: number;
  totalPages: number;
  language: string;
  status: string;
  progress: number;
  error?: string;
  createdAt: string;
  pageCount?: number;
  unitCount?: number;
}

export interface ExtractedUnit {
  id: string;
  unitNumber: number;
  titleAr: string;
  titleEn: string;
  description: string;
  order: number;
  ExtractedLesson: ExtractedLesson[];
}

export interface ExtractedLesson {
  id: string;
  lessonNumber: number;
  titleAr: string;
  titleEn: string;
  content: string;
  summary: string;
  keyPoints: string[] | string;
  order: number;
  status: string;
}

export interface ServiceInfo {
  name: string;
  label: string;
  connected: boolean;
  port: number;
  availableModels: { name: string; size: string; type: string }[];
}

export type LogType = 'info' | 'success' | 'warning' | 'error';

export interface LogEntry {
  id: string;
  type: LogType;
  message: string;
  timestamp: string;
  bookId?: string;
}

export interface AppSettings {
  ocrLanguage: string;
  ocrQuality: 'low' | 'medium' | 'high';
  lmStudioPort: number;
  ollamaPort: number;
  defaultLLMService: 'lmstudio' | 'ollama';
  defaultLLMModel: string;
  autoSave: boolean;
  theme: 'light' | 'dark' | 'system';
}

interface FactoryState {
  // Navigation
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;

  // Books
  books: Book[];
  setBooks: (books: Book[]) => void;
  selectedBookId: string | null;
  setSelectedBookId: (id: string | null) => void;

  // Extraction
  isExtracting: boolean;
  setIsExtracting: (v: boolean) => void;
  isProcessing: boolean;
  setIsProcessing: (v: boolean) => void;
  extractionProgress: number;
  setExtractionProgress: (v: number) => void;

  // Content
  units: ExtractedUnit[];
  setUnits: (units: ExtractedUnit[]) => void;
  selectedLessonId: string | null;
  setSelectedLessonId: (id: string | null) => void;

  // Services
  services: ServiceInfo[];
  setServices: (services: ServiceInfo[]) => void;

  // Logs
  logs: LogEntry[];
  addLog: (entry: Omit<LogEntry, 'id' | 'timestamp'>) => void;
  clearLogs: () => void;

  // Settings
  settings: AppSettings;
  updateSettings: (settings: Partial<AppSettings>) => void;

  // Stats
  stats: {
    totalBooks: number;
    totalPagesExtracted: number;
    totalUnits: number;
    totalLessons: number;
  };
  setStats: (stats: Partial<FactoryState['stats']>) => void;
}

export const useFactoryStore = create<FactoryState>((set) => ({
  // Navigation
  activeTab: 'home',
  setActiveTab: (tab) => set({ activeTab: tab }),
  sidebarCollapsed: false,
  toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),

  // Books
  books: [],
  setBooks: (books) => set({ books }),
  selectedBookId: null,
  setSelectedBookId: (id) => set({ selectedBookId: id }),

  // Extraction
  isExtracting: false,
  setIsExtracting: (v) => set({ isExtracting: v }),
  isProcessing: false,
  setIsProcessing: (v) => set({ isProcessing: v }),
  extractionProgress: 0,
  setExtractionProgress: (v) => set({ extractionProgress: v }),

  // Content
  units: [],
  setUnits: (units) => set({ units }),
  selectedLessonId: null,
  setSelectedLessonId: (id) => set({ selectedLessonId: id }),

  // Services
  services: [],
  setServices: (services) => set({ services }),

  // Logs
  logs: [],
  addLog: (entry) => set((s) => ({
    logs: [{ ...entry, id: crypto.randomUUID(), timestamp: new Date().toISOString() }, ...s.logs].slice(0, 200),
  })),
  clearLogs: () => set({ logs: [] }),

  // Settings
  settings: {
    ocrLanguage: 'ara',
    ocrQuality: 'high',
    lmStudioPort: 1234,
    ollamaPort: 11434,
    defaultLLMService: 'lmstudio',
    defaultLLMModel: 'qwen2.5-7b',
    autoSave: true,
    theme: 'dark',
  },
  updateSettings: (newSettings) => set((s) => ({
    settings: { ...s.settings, ...newSettings },
  })),

  // Stats
  stats: { totalBooks: 0, totalPagesExtracted: 0, totalUnits: 0, totalLessons: 0 },
  setStats: (newStats) => set((s) => ({ stats: { ...s.stats, ...newStats } })),
}));