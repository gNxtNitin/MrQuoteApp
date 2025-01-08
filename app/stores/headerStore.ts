import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface HeaderState {
  selectedCompany: number;
  lastSelectedCompany: number | null;
  showSwitcher: boolean;
  companies: number[];
  setSelectedCompany: (id: number) => void;
  setLastSelectedCompany: (id: number) => void;
  setShowSwitcher: (show: boolean) => void;
  setCompanies: (companies: number[]) => void;
  clearCompanyState: () => void;
}

const initialState = {
  selectedCompany: 1,
  lastSelectedCompany: null,
  showSwitcher: false,
  companies: [],
};

export const useHeaderStore = create<HeaderState>()(
  persist(
    (set) => ({
      ...initialState,
      setSelectedCompany: (id) => set({ selectedCompany: id }),
      setLastSelectedCompany: (id) => set({ lastSelectedCompany: id }),
      setShowSwitcher: (show) => set({ showSwitcher: show }),
      setCompanies: (companies) => set({ companies }),
      clearCompanyState: () => set(initialState),
    }),
    {
      name: 'header-storage',
      storage: createJSONStorage(() => ({
        getItem: async (name: string) => {
          const value = await AsyncStorage.getItem(name);
          return value ? JSON.parse(value) : null;
        },
        setItem: async (name: string, value: any) => {
          await AsyncStorage.setItem(name, JSON.stringify(value));
        },
        removeItem: async (name: string) => {
          await AsyncStorage.removeItem(name);
        },
      })),
    }
  )
); 