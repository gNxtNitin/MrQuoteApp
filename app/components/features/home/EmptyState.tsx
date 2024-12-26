import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '@/app/constants/colors';
import { Image } from "expo-image";


interface EmptyStateProps {
  isSyncing?: boolean;
}

export function EmptyState({ isSyncing }: EmptyStateProps) {
  return (
    <View style={styles.container}>
      <Image 
        source={isSyncing 
          ? require('@/assets/images/sync-animation.gif')
          : require('@/assets/images/empty-state.png')
        }
        style={styles.image}
        resizeMode="contain"
      />
      <Text style={styles.text}>
        {isSyncing 
          ? 'Syncing data from Service Fusion... \nUpdating your information now—this will only take a moment.'
          : 'It appears there are no estimations for you to work on currently. Kindly come online and click the Sync button above to check for any pending estimations.'
        }
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
    fontWeight: 'bold',
    color: '#666',
    maxWidth: 500,
  },
}); 