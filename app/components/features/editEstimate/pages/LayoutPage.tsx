import { View, Text, StyleSheet } from 'react-native';

export function LayoutPage() {
  return (
    <View style={styles.container}>
      <Text>Layout Page Content</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
}); 