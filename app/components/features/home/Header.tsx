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
import { useState, useEffect } from "react";
import { CompanySwitcher } from "../company/CompanySwitcher";
import { router } from "expo-router";
import { create } from "zustand";
import { MaterialIcons } from "@expo/vector-icons";
import { useTheme } from "@/app/components/providers/ThemeProvider";
import { useThemeStore } from "@/app/stores/themeStore";
import { usePathname } from "expo-router";
import { useSidebarStore } from "@/app/stores/sidebarStore";
import { useAuth } from '@/app/hooks/useAuth';
import { initialsName } from "../../common/Utils";
import { Company, CompanyData } from "@/app/database/models/Company";
import { useHeaderStore } from '@/app/stores/headerStore';

export function Header() {
  const { 
    showSwitcher, 
    selectedCompany, 
    setShowSwitcher, 
    setSelectedCompany,
    lastSelectedCompany,
    setLastSelectedCompany 
  } = useHeaderStore();
  const theme = useTheme();
  const { isDarkMode, toggleTheme } = useThemeStore();
  const pathname = usePathname();
  const showSidebarButton = pathname === "/editEstimate";
  const { open: openSidebar } = useSidebarStore();
  const { logout, user } = useAuth();
  
  const [companies, setCompanies] = useState<CompanyData[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        if (user?.company_id) {
          const companyIds = JSON.parse(user.company_id as string);
          
          const companyDetails = await Promise.all(
            companyIds.map(async (id: number) => {
              const company = await Company.getById(id);
              return company;
            })
          );

          const validCompanies = companyDetails.filter(Boolean);
          setCompanies(validCompanies);
          
          // Only set company if not already initialized
          if (!isInitialized) {
            // If there's a last selected company and it's in the user's companies, use it
            if (lastSelectedCompany && companyIds.includes(lastSelectedCompany)) {
              setSelectedCompany(lastSelectedCompany);
            }
            // Otherwise, if no company is selected and we have companies, select the first one
            else if ((!selectedCompany || !companyIds.includes(selectedCompany)) && validCompanies.length > 0) {
              setSelectedCompany(validCompanies[0].id!);
              setLastSelectedCompany(validCompanies[0].id!);
            }
            setIsInitialized(true);
          }
        }
      } catch (error) {
        console.error('Error fetching companies:', error);
      }
    };

    fetchCompanies();
  }, [user?.company_id, isInitialized]);

  const handleSelectCompany = (companyId: number) => {
    setSelectedCompany(companyId);
    setLastSelectedCompany(companyId);
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

  const getCompanyLogo = (companyId: number) => {
    switch (companyId) {
      case 1:
        return require("@/assets/images/gutter-logo.png");
      case 2:
        return require("@/assets/images/roofing-logo.png");
      default:
        return require("@/assets/images/gutter-logo.png");
    }
  };

  const logoToShow = currentCompany ? getCompanyLogo(currentCompany.id as number) : null;

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

        <View style={styles.rightSection}>
          <Pressable style={styles.themeButton} onPress={toggleTheme}>
            <MaterialIcons
              name={isDarkMode ? "light-mode" : "dark-mode"}
              size={24}
              color={Colors.white}
            />
          </Pressable>
          {logoToShow && (
            <Image source={logoToShow} resizeMode="contain" style={styles.dynamicLogo} />
          )}
          <Text style={styles.companyName}>
            {currentCompany?.company_name?.toUpperCase()}
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
                  {initialsName(`${user?.first_name || ''} ${user?.last_name || ''}`)}
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
