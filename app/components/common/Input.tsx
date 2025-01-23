import React from "react";
import { TextInput, StyleSheet, TextInputProps, View } from "react-native";
import { Colors } from "@/app/constants/colors";
import { useTheme } from "../providers/ThemeProvider";

interface InputProps extends TextInputProps {
  style?: any;
}

export function Input({ style, ...props }: InputProps) {
  const theme = useTheme();

  return (
    <View style={[styles.container, style]}>
      <TextInput
        style={[styles.input, { color: theme.textSecondary }]}
        placeholderTextColor={theme.placeholder}
        {...props}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  input: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
  },
});
