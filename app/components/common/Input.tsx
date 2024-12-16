import React from 'react';
import { TextInput, StyleSheet, TextInputProps, View } from 'react-native';
import { Colors } from '@/app/constants/colors';

interface InputProps extends TextInputProps {
  style?: any;
}

export function Input({ style, ...props }: InputProps) {
  return (
    <View style={[styles.container, style]}>
      <TextInput
        style={styles.input}
        placeholderTextColor="#999"
        {...props}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  input: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: Colors.black,
  }
});
