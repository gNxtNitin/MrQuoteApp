import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface HeaderState {
  selectedCompany: number;
  lastSelectedCompany: number | null;
  showSwitcher: boolean;
  companies: number[];
  companyLayouts: Record<number, { layoutId: number; layoutName: string }>;
  setSelectedCompany: (id: number) => void;
  setLastSelectedCompany: (id: number) => void;
  setShowSwitcher: (show: boolean) => void;
  setCompanies: (companies: number[]) => void;
  setCompanyLayout: (companyId: number, layoutId: number, layoutName: string) => void;
  clearCompanyState: () => void;
}

const initialState = {
  selectedCompany: 1,
  lastSelectedCompany: null,
  showSwitcher: false,
  companies: [],
  companyLayouts: {},
};

export const useHeaderStore = create<HeaderState>()(
  persist(
    (set) => ({
      ...initialState,
      setSelectedCompany: (id) => set({ selectedCompany: id }),
      setLastSelectedCompany: (id) => set({ lastSelectedCompany: id }),
      setShowSwitcher: (show) => set({ showSwitcher: show }),
      setCompanies: (companies) => set({ companies }),
      setCompanyLayout: (companyId, layoutId, layoutName) => 
        set((state) => ({
          companyLayouts: {
            ...state.companyLayouts,
            [companyId]: { layoutId, layoutName }
          }
        })),
      clearCompanyState: () => set(initialState),
    }),
    {
      name: 'header-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
); 