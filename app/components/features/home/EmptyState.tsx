import { View, Text, Image, StyleSheet } from 'react-native';
import { Colors } from '@/app/constants/colors';

export function EmptyState() {
  return (
    <View style={styles.container}>
      <Image 
        source={require('@/assets/images/empty-state.png')}
        style={styles.image}
        resizeMode="contain"
      />
      <Text style={styles.text}>
        It appears there are no estimations for you to work on currently. Kindly come online and click the Sync button above to check for any pending estimations.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  image: {
    width: '100%',
    height: 200,
    marginBottom: 24,
  },
  text: {
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
    maxWidth: 500,
  },
}); 