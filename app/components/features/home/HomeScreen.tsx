import { View, StyleSheet } from 'react-native';
import { Colors } from '@/app/constants/colors';
import { Header } from './Header';
import { SubHeader } from './SubHeader';
import { EmptyState } from './EmptyState';

export function HomeScreen() {
  const handleSync = () => {
    // Add sync logic
  };

  const handleCreate = () => {
    // Add create logic
  };

  return (
    <View style={styles.container}>
      <Header />
      <SubHeader onSync={handleSync} onCreate={handleCreate} />
      <View style={styles.content}>
        <EmptyState />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  content: {
    flex: 1,
  },
}); 