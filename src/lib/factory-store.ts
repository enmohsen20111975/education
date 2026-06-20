import { create } from 'zustand';

export type TabType = 'books' | 'extraction' | 'models' | 'content';

interface FactoryState {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  selectedBookId: string | null;
  setSelectedBookId: (id: string | null) => void;
  isExtracting: boolean;
  setIsExtracting: (v: boolean) => void;
  isProcessing: boolean;
  setIsProcessing: (v: boolean) => void;
  extractionProgress: number;
  setExtractionProgress: (v: number) => void;
  processingProgress: number;
  setProcessingProgress: (v: number) => void;
}

export const useFactoryStore = create<FactoryState>((set) => ({
  activeTab: 'books',
  setActiveTab: (tab) => set({ activeTab: tab }),
  selectedBookId: null,
  setSelectedBookId: (id) => set({ selectedBookId: id }),
  isExtracting: false,
  setIsExtracting: (v) => set({ isExtracting: v }),
  isProcessing: false,
  setIsProcessing: (v) => set({ isProcessing: v }),
  extractionProgress: 0,
  setExtractionProgress: (v) => set({ extractionProgress: v }),
  processingProgress: 0,
  setProcessingProgress: (v) => set({ processingProgress: v }),
}));