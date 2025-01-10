import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Colors } from "@/app/constants/colors";
import { MaterialIcons } from "@expo/vector-icons";
import { Card } from "./Card";

interface CustomCollapsibleProps {
  title: string;
  children: React.ReactNode;
}

export const CustomCollapsible: React.FC<CustomCollapsibleProps> = ({
  title,
  children,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(true);

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <Card>
      <TouchableOpacity onPress={toggleCollapse} style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        <MaterialIcons
          name={isCollapsed ? "keyboard-arrow-down" : "keyboard-arrow-up"}
          size={25}
          color={Colors.primary}
        />
      </TouchableOpacity>

      <View
        style={[
          styles.contentContainer,
          { height: isCollapsed ? 0 : 'auto' },
        ]}
      >
        {children}
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: Colors.gray[500],
    borderRadius: 10,
  },
  header: {
    flexDirection: "row",
    padding: 15,
    justifyContent: "space-between",
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.primary,
  },
  contentContainer: {
    overflow: "hidden",
    backgroundColor: Colors.white,
  },
});
