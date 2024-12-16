import { create } from 'zustand';

interface CustomPage {
  id: number;
  title: string;
}

interface EstimatePageState {
  currentPage: string;
  customPages: CustomPage[];
  setCurrentPage: (page: string) => void;
  addCustomPage: (page: CustomPage) => void;
  removeCustomPage: (id: number) => void;
}

export const useEstimatePageStore = create<EstimatePageState>((set) => ({
  currentPage: 'Title',
  customPages: [],
  setCurrentPage: (page) => set({ currentPage: page }),
  addCustomPage: (page) => set((state) => ({
    customPages: [...state.customPages, page],
  })),
  removeCustomPage: (id) => set((state) => ({
    customPages: state.customPages.filter(page => page.id !== id),
  })),
}));