import { View, Text, StyleSheet } from 'react-native';

export function IntroductionPage() {
  return (
    <View style={styles.container}>
      <Text>Introduction Page Content</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
}); 