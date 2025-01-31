import React, { useState } from "react";
import {
  Animated,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Colors } from "@/app/constants/colors";
import {
  EstimateDetailsTab,
  CustomerDetailsTab,
  PropertyMeasurementsTab,
} from "./EstimateSettingsTab";
import { ScreenLayout } from "../../common/ScreenLayout";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useTheme } from "@/app/components/providers/ThemeProvider";
import { ScrollView } from "react-native-gesture-handler";

interface EstimateSettingsScreenProps {
  onSettingsAuth: () => void;
  isDarkMode: boolean;
}

export function EstimateSettingsScreen({
  onSettingsAuth,
  isDarkMode,
}: EstimateSettingsScreenProps) {
  const theme = useTheme();


  const [activeTab, setActiveTab] = useState("Estimate Details");
  const [indicatorPosition] = useState(new Animated.Value(0));


  const tabs = [
    { label: "Estimate Details", component: <EstimateDetailsTab /> },
    { label: "Customer Details", component: <CustomerDetailsTab /> },
    { label: "Property Measurements", component: <PropertyMeasurementsTab /> },
  ];

  const handleTabPress = (index: number) => {
    setActiveTab(tabs[index].label);
    Animated.timing(indicatorPosition, {
      toValue: index * (100 / tabs.length),
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  const renderTabContent = () =>
    tabs.find((tab) => tab.label === activeTab)?.component || null;

  const handleBack = () => router.back();

  return (
    <ScreenLayout>
      <View style={{padding:16}}>
      <Pressable style={styles.backButton} onPress={handleBack}>
        <MaterialIcons name="arrow-back" size={20} color={theme.textPrimary} />
        <Text style={[styles.backText, { color: theme.textPrimary }]}>Back</Text>
      </Pressable>
      </View>
      <ScrollView style={{ flex: 1 }}>
        <View style={styles.container}>
          <View style={styles.tabBarContainer}>
            <Animated.View
              style={[
                styles.indicator,
                {
                  width: `${100 / tabs.length}%`,
                  left: indicatorPosition.interpolate({
                    inputRange: [0, 100],
                    outputRange: ["0%", "100%"],
                  }),
                },{backgroundColor:theme.card}
              ]}
            />
            <View style={styles.tabBar}>
              {tabs.map((tab, index) => (
                <TouchableOpacity
                  key={tab.label}
                  style={styles.tabButton}
                  onPress={() => handleTabPress(index)}
                >
                  <Text
                    style={[
                      styles.tabText,
                      activeTab === tab.label && styles.activeTabText,{color:theme.textPrimary}
                    ]}
                  >
                    {tab.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          {renderTabContent()}
        </View>
      </ScrollView>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 10,
    paddingHorizontal: 20,
  },

  tabBarContainer: {
    position: "relative",
    width: "100%",
    marginBottom: 10,
    borderRadius:20,
  },
  tabBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    borderRadius:20

  },
  tabButton: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 10,
  },
  indicator: {
    position: "absolute",
    height: "100%",
    borderRadius: 5,
    zIndex: -1,
  },
  tabText: {
    fontSize: 16,
    fontWeight: "600",
  },
  activeTabText: {
    width: "80%",
    fontSize: 18,
    borderBottomWidth: 2,
    textAlign: "center",
    borderColor: Colors.primary,
    marginStart: 20,
    paddingVertical: 5,
  },
  backButton: { flexDirection: "row", alignItems: "center", gap: 6,width:100 },

  backText: { fontSize: 16, color: Colors.primary, fontWeight: "600" },
});
