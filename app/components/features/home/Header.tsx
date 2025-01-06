import {
  View,
  Text,
  Image,
  StyleSheet,
  Platform,
  StatusBar,
  Pressable,
} from "react-native";
import { Colors } from "@/app/constants/colors";
import { useState } from "react";
import { CompanySwitcher } from "../company/CompanySwitcher";
import { router } from "expo-router";
import { create } from "zustand";
import { MaterialIcons } from "@expo/vector-icons";
import { useTheme } from "@/app/components/providers/ThemeProvider";
import { useThemeStore } from "@/app/stores/themeStore";
import { usePathname } from "expo-router";
import { useSidebarStore } from "@/app/stores/sidebarStore";
import { useAuth } from '@/app/hooks/useAuth';

interface HeaderState {
  showSwitcher: boolean;
  selectedCompany: string;
  setShowSwitcher: (show: boolean) => void;
  setSelectedCompany: (companyId: string) => void;
}

const useHeaderStore = create<HeaderState>((set) => ({
  showSwitcher: false,
  selectedCompany: "gutter",
  setShowSwitcher: (show) => set({ showSwitcher: show }),
  setSelectedCompany: (companyId) => set({ selectedCompany: companyId }),
}));

export function Header() {
  const { showSwitcher, selectedCompany, setShowSwitcher, setSelectedCompany } =
    useHeaderStore();
  const theme = useTheme();
  const { isDarkMode, toggleTheme } = useThemeStore();
  const pathname = usePathname();
  const showSidebarButton = pathname === "/editEstimate";
  const { open: openSidebar } = useSidebarStore();
  const { logout } = useAuth();

  const companies = [
    {
      id: "gutter",
      borderColor: "#0F5695",
      name: "Mr. Gutter",
      color: "#f3f4f6",
    },
    {
      id: "roofing",
      borderColor: "#ef4444",
      name: "Mr. Roofing",
      color: "#f3f4f6",
    },
  ];

  const handleSelectCompany = (companyId: string) => {
    setSelectedCompany(companyId);
    setShowSwitcher(false);
  };

  const handleLogout = async () => {
    await logout();
    setShowSwitcher(false);
  };

  const handleLogoPress = () => {
    router.replace("/home");
  };

  const currentCompany = companies.find(
    (company) => company.id === selectedCompany
  );

  const handleToggleSidebar = () => {
    openSidebar();
  };

  const gutter = require("@/assets/images/gutter-logo.png");
  const roofing = require("@/assets/images/roofing-logo.png");

  const logoToShow = selectedCompany === "gutter" ? gutter : roofing;

  return (
    <View style={[styles.header, { zIndex: 9999 }]}>
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
              source={require("@/assets/images/header-logo.png")}
              style={styles.logo}
              resizeMode="contain"
            />
          </Pressable>
        </View>

        <View style={[styles.rightSection, { zIndex: 9999 }]}>
          <Pressable onPress={toggleTheme} style={styles.themeButton}>
            <MaterialIcons
              name={isDarkMode ? "light-mode" : "dark-mode"}
              size={24}
              color={Colors.white}
            />
          </Pressable>
          <Image source={logoToShow} resizeMode="contain" style={styles.dynamicLogo} />
          <Text style={styles.companyName}>
            {currentCompany?.name.toUpperCase()}
          </Text>
          <View>
            <Pressable
              onPress={() => setShowSwitcher(!showSwitcher)}
              style={styles.companyButton}
            >
              <View
                style={[
                  styles.initialCircle,
                  { backgroundColor: Colors.white },
                ]}
              >
                <Text style={[styles.initial, { color: Colors.primary }]}>
                  {"AS"}
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
    paddingTop: Platform.OS === "ios" ? 50 : StatusBar.currentHeight ?? 10 + 10,
  },
  content: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingBottom: 20,
  },
  leftSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  logo: {
    width: 180,
  },
  rightSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  themeButton: {
    padding: 8,
  },
  companyName: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.white,
  },
  companyButton: {
    padding: 4,
  },
  initialCircle: {
    width: 60,
    height: 60,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  initial: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.white,
  },
  switcherWrapper: {
    position: 'relative',
    zIndex: 9999,
  },
  switcherContainer: {
    position: "absolute",
    top: "100%",
    right: 0,
    zIndex: 9999,
    width: 300,
    elevation: 5,
    shadowColor: "#000",
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
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  dynamicLogo:{
    height:30,
    width:50
  }
});
