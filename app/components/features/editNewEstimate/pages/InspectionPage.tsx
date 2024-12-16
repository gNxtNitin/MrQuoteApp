import { View, Text, StyleSheet } from 'react-native';

export function InspectionPage() {
  return (
    <View style={styles.container}>
      <Text>Inspection Page Content</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
}); 