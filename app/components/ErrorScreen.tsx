import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';

interface ErrorScreenProps {
  message: string;
}

const ErrorScreen: React.FC<ErrorScreenProps> = ({ message }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.errorMessage}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  errorMessage: {
    fontSize: 18,
    color: 'red',
    marginBottom: 20,
    textAlign: 'center',
  },
});

export default ErrorScreen; 