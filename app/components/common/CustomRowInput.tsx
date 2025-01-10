import { Colors } from "@/app/constants/colors";
import React from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";

interface CustomInputRowProps {
  label: string;
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  inputMode: "text" | "numeric" | "decimal" | "tel";
  suffix?: string;
}

export const CustomInputRow: React.FC<CustomInputRowProps> = ({
  label,
  placeholder,
  value,
  onChangeText,
  inputMode,
  suffix,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          value={value}
          onChangeText={onChangeText}
          keyboardType={
            inputMode === "numeric" || inputMode === "decimal"
              ? "numeric"
              : "default"
          }
        />
        {suffix && <Text style={styles.suffix}>{suffix}</Text>}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    // alignItems: "center",
    marginVertical: 8,
    gap: 5,
  },
  label: {
    // width: 100,
    fontSize: 16,
    color: Colors.black,
    fontWeight: "600",
  },
  inputContainer: {
    flex: 2,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.gray[500],
    borderRadius: 10,
    paddingHorizontal: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: Colors.black,
  },
  suffix: {
    fontSize: 16,
    color: Colors.black,
    marginLeft: 5,
  },
});
