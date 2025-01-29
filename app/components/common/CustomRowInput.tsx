import { Colors } from "@/app/constants/colors";
import React from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { useTheme } from "../providers/ThemeProvider";

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

  const theme = useTheme()

  return (
    <View style={styles.container}>
      <Text style={[styles.label,{color:theme.textSecondary}]}>{label}</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={[styles.input,{color:theme.textSecondary}]}
          placeholder={placeholder}
          placeholderTextColor={theme.placeholder}
          
          value={value}
          onChangeText={onChangeText}
          keyboardType={
            inputMode === "numeric" || inputMode === "decimal"
              ? "numeric"
              : "default"
          }
        />
        {suffix && <Text style={[styles.suffix,{color:theme.textSecondary}]}>{suffix}</Text>}
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
    height: 40,
  },
  input: {
    flex: 1,
    fontSize: 16,
  },
  suffix: {
    fontSize: 16,
    marginLeft: 5,
  },
});
