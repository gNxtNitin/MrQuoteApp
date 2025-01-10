import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  ScrollView,
} from "react-native";
import { Colors } from "@/app/constants/colors";
import { MaterialIcons } from "@expo/vector-icons";

interface CustomDropdownRowProps {
  label: string;
  value: string;
  onValueChange: (value: string) => void;
  options: string[];
}

export const CustomDropdownRow: React.FC<CustomDropdownRowProps> = ({
  label,
  value,
  onValueChange,
  options,
}) => {
  const [isDropdownVisible, setDropdownVisible] = useState(false);

  const handleOptionSelect = (option: string) => {
    onValueChange(option);
    setDropdownVisible(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View
        style={[
          styles.dropdownContainer,
          value ? { borderColor: Colors.primary } : null,
        ]}
      >
        <TouchableOpacity
          style={styles.selectedValueContainer}
          onPress={() => setDropdownVisible(!isDropdownVisible)}
        >
          <Text style={styles.selectedValueText}>
            {value || "Select an option"}
          </Text>
          <MaterialIcons
            name={
              isDropdownVisible ? "keyboard-arrow-up" : "keyboard-arrow-down"
            }
            size={24}
            color={Colors.black}
          />
        </TouchableOpacity>

        {isDropdownVisible && (
          <View style={styles.dropdownMenu}>
            <ScrollView horizontal={true} style={{ width: "100%" }}>
              <FlatList
                data={options}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.dropdownItem}
                    onPress={() => handleOptionSelect(item)}
                  >
                    <Text style={styles.dropdownItemText}>{item}</Text>
                  </TouchableOpacity>
                )}
              />
            </ScrollView>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    marginVertical: 8,
    gap: 5,
  },
  label: {
    fontSize: 16,
    color: Colors.black,
    fontWeight: "600",
  },
  dropdownContainer: {
    flex: 2,
    position: "relative",
    borderWidth: 1,
    borderColor: Colors.gray[500],
    borderRadius: 10,
  },
  selectedValueContainer: {
    padding: 10,
    height: 40,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: Colors.white,
    borderRadius: 10,
  },
  selectedValueText: {
    fontSize: 16,
    color: Colors.black,
  },
  dropdownMenu: {
    position: "absolute",
    top: 50,
    left: 0,
    right: 0,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.gray[500],
    borderRadius: 10,
    zIndex: 10,
    maxHeight: 200,
  },
  dropdownItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray[300],
  },
  dropdownItemText: {
    fontSize: 16,
    color: Colors.black,
  },
});
