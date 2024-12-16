import { View, Text, StyleSheet } from 'react-native';

export function TitlePage() {
  return (
    <View style={styles.container}>
      <Text>Title Page Content</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
}); 