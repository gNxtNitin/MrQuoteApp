import { create } from 'zustand';

interface CustomPage {
  id: number;
  title: string;
  type: 'myPDFs' | 'sharedPDFs' | 'singleUsePDFs' | 'textPage';
  requireAcknowledge: boolean;
  content?: {
    textPage?: string;
    myPDFs?: {
      selectedFiles?: string[];
      // Add other myPDFs specific data
    };
    sharedPDFs?: {
      selectedFiles?: string[];
      // Add other sharedPDFs specific data
    };
    singleUsePDFs?: {
      file?: string;
      // Add other singleUsePDF specific data
    };
  };
}

interface EstimatePageState {
  currentPage: string;
  customPages: CustomPage[];
  setCurrentPage: (page: string) => void;
  addCustomPage: (page: Partial<CustomPage>) => void;
  removeCustomPage: (id: number) => void;
  updateCustomPage: (id: number, data: Partial<CustomPage>) => void;
}

export const useEstimatePageStore = create<EstimatePageState>((set) => ({
  currentPage: 'Title',
  customPages: [],
  setCurrentPage: (page) => set({ currentPage: page }),
  addCustomPage: (page) => set((state) => ({
    customPages: [...state.customPages, {
      id: page.id || Math.max(...state.customPages.map(p => p.id), 0) + 1,
      title: page.title || `Custom Page ${state.customPages.length + 1}`,
      type: page.type || 'myPDFs',
      requireAcknowledge: page.requireAcknowledge || false,
      content: page.content || {},
    }],
  })),
  removeCustomPage: (id) => set((state) => ({
    customPages: state.customPages.filter(page => page.id !== id),
  })),
  updateCustomPage: (id, data) => set((state) => ({
    customPages: state.customPages.map(page => 
      page.id === id ? { ...page, ...data } : page
    ),
  })),
}));