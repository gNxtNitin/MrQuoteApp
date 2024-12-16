import { View, Text, Image, StyleSheet, Platform, StatusBar, Pressable } from 'react-native';
import { Colors } from '@/app/constants/colors';
import { useState } from 'react';
import { CompanySwitcher } from '../company/CompanySwitcher';
import { router } from 'expo-router';
import { create } from 'zustand';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '@/app/components/providers/ThemeProvider';
import { useThemeStore } from '@/app/stores/themeStore';
import { usePathname } from 'expo-router';
import { useSidebarStore } from '@/app/stores/sidebarStore';

interface HeaderState {
  showSwitcher: boolean;
  selectedCompany: string;
  setShowSwitcher: (show: boolean) => void;
  setSelectedCompany: (companyId: string) => void;
}

const useHeaderStore = create<HeaderState>((set) => ({
  showSwitcher: false,
  selectedCompany: 'gutter',
  setShowSwitcher: (show) => set({ showSwitcher: show }),
  setSelectedCompany: (companyId) => set({ selectedCompany: companyId }),
}));

export function Header() {
  const { showSwitcher, selectedCompany, setShowSwitcher, setSelectedCompany } = useHeaderStore();
  const theme = useTheme();
  const { isDarkMode, toggleTheme } = useThemeStore();
  const pathname = usePathname();
  const showSidebarButton = pathname === '/editCreateEstimate';
  const { open: openSidebar } = useSidebarStore();

  const companies = [
    { id: 'gutter', initial: 'MG', name: 'Mr. Gutter', color: '#4A90E2' },
    { id: 'roofing', initial: 'MR', name: 'Mr. Roofing', color: '#50C878' },
  ];

  const handleSelectCompany = (companyId: string) => {
    setSelectedCompany(companyId);
    setShowSwitcher(false);
  };

  const handleLogout = () => {
    router.replace('/login');
  };

  const handleLogoPress = () => {
    router.replace('/home');
  };

  const currentCompany = companies.find(company => company.id === selectedCompany);

  const handleToggleSidebar = () => {
    openSidebar();
  };

  return (
    <View style={styles.header}>
      <View style={styles.content}>
        <View style={styles.leftSection}>
          {showSidebarButton && (
            <Pressable 
              style={styles.sidebarButton} 
              onPress={handleToggleSidebar}
            >
              <View style={styles.sidebarIconContainer}>
                <MaterialIcons name="menu" size={24} color={Colors.white} />
              </View>
            </Pressable>
          )}
          <Pressable onPress={handleLogoPress}>
            <Image 
              source={require('@/assets/images/header-logo.png')}
              style={styles.logo}
              resizeMode="contain"
            />
          </Pressable>
        </View>

        <View style={styles.rightSection}>
          <Pressable onPress={toggleTheme} style={styles.themeButton}>
            <MaterialIcons 
              name={isDarkMode ? "light-mode" : "dark-mode"} 
              size={24} 
              color={Colors.white} 
            />
          </Pressable>
          <Text style={styles.companyName}>{currentCompany?.name.toUpperCase()}</Text>
          <View>
            <Pressable 
              onPress={() => setShowSwitcher(!showSwitcher)}
              style={styles.companyButton}
            >
              <View style={[
                styles.initialCircle,
                { backgroundColor: Colors.white }
              ]}>
                <Text style={[styles.initial, { color: currentCompany?.color }]}>
                  {currentCompany?.initial}
                </Text>
              </View>
            </Pressable>
            {showSwitcher && (
              <View style={styles.switcherContainer}>
                <CompanySwitcher
                  companies={companies}
                  selectedCompany={selectedCompany}
                  onSelectCompany={handleSelectCompany}
                  onLogout={handleLogout}
                />
              </View>
            )}
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: Colors.primary,
    paddingTop: Platform.OS === 'ios' ? 50 : StatusBar.currentHeight ?? 10 + 10,
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingBottom: 20
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  logo: {
    width: 180,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  themeButton: {
    padding: 8,
  },
  companyName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.white,
  },
  companyButton: {
    padding: 4,
  },
  initialCircle: {
    width: 60,
    height: 60,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  initial: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.white,
  },
  switcherContainer: {
    position: 'absolute',
    top: '100%',
    right: 0,
    zIndex: 1000,
    width: 300,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  sidebarButton: {
    padding: 4,
  },
  sidebarIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});