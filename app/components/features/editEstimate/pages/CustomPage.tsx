import { View, Text, StyleSheet } from 'react-native';

export function CustomPage() {
  return (
    <View style={styles.container}>
      <Text>Custom Page Content</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
}); 
