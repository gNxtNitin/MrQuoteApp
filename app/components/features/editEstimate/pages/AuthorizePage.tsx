import { View, Text, StyleSheet } from 'react-native';

export function AuthorizePage() {
  return (
    <View style={styles.container}>
      <Text>Authorize Page Content</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
}); 