import React from "react";
import { View, Text, Pressable, StyleSheet, Image } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { Colors } from "@/app/constants/colors";
import { useAuth } from '@/app/hooks/useAuth';
import { initialsName } from "../../common/Utils";
import { CompanyData } from "@/app/database/models/Company";
const gutter = require("@/assets/images/gutter-logo.png");
const roofing = require("@/assets/images/roofing-logo.png");

interface Company {
  id: string;
  name: string;
  color: string;
  borderColor: string;
  logo?: string;
}

interface CompanySwitcherProps {
  companies: CompanyData[];
  selectedCompany: number;
  onSelectCompany: (companyId: number) => void;
  onLogout: () => void;
}

export function CompanySwitcher({
  companies,
  selectedCompany,
  onSelectCompany,
  onLogout,
}: CompanySwitcherProps) {
  const { logout, user } = useAuth();

  const handleLogout = async () => {
    await logout();
    onLogout();
  };

  return (
    <View style={[styles.container, { zIndex: 9999 }]}>
      <View style={styles.userInfo}>
        <View style={styles.userIcon}>
          <Text style={styles.userInitials}>
            {initialsName(`${user?.first_name || ''} ${user?.last_name || ''}`)}
          </Text>
        </View>
        <View>
          <Text style={styles.userName}>
            {`${user?.first_name || ''} ${user?.last_name || ''}`}
          </Text>
          <Text style={styles.userStatus}>
            {user?.is_active ? 'Active' : 'Inactive'}
          </Text>
        </View>
      </View>

      <View style={styles.divider} />

      <Text style={styles.title}>Switch Company</Text>

      <View style={styles.divider} />

      {companies.map((company) => {
        let logoSource;

        if (company.company_logo === "gutter") {
          logoSource = gutter;
        } else if (company.company_logo === "roofing") {
          logoSource = roofing;
        }

        return (
          <Pressable
            key={company.id}
            style={styles.companyRow}
            onPress={() => onSelectCompany(company.id || 0)}
          >
            <View
              style={[
                styles.companyIcon,
                {
                  backgroundColor: Colors.gray[100],
                  marginStart: 14,
                  borderColor: Colors.gradientPrimary,
                },
              ]}
            >
              <Image source={logoSource} style={styles.logo} resizeMode="contain" />
            </View>
            <Text style={[styles.companyName, { marginStart: 14 }]}>
              {company.company_name}
            </Text>
            {selectedCompany === company.id ? (
              <MaterialIcons
                name="check-circle"
                size={24}
                color={Colors.primary}
              />
            ) : (
              <View style={styles.uncheckedCircle} />
            )}
          </Pressable>
        );
      })}

      <Pressable style={styles.logoutRow} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
        <MaterialIcons name="logout" size={24} color="#666" />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
    width: 300,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    zIndex: 9999,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  userIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#e0e0e0",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  userInitials: {
    fontSize: 24,
    fontWeight: "600",
    color: Colors.black,
  },
  userName: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.black,
  },
  userStatus: {
    fontSize: 14,
    color: "#666",
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
    marginTop: 16,
    color: Colors.black,
  },
  divider: {
    height: 1,
    backgroundColor: "#f0f0f0",
  },
  companyRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  companyIcon: {
    width: 40,
    height: 40,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    borderWidth: 1,
  },
  initial: {
    color: Colors.white,
    fontSize: 18,
    fontWeight: "600",
  },
  companyName: {
    flex: 1,
    fontSize: 16,
    color: Colors.black,
  },
  uncheckedCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#ddd",
  },
  logoutRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 4,
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  logoutText: {
    fontSize: 16,
    color: "#666",
  },
  logo: {
    width: 30,
    height: 30,
    borderRadius: 15,
    
  },
});
