import { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Colors } from '@/app/constants/colors';
import { Header } from './Header';
import { SubHeader } from './SubHeader';
import { EmptyState } from './EmptyState';
import { SyncDialog } from '../sync/SyncDialog';
import { EstimatesList } from './EstimatesList';

export function HomeScreen() {
  const [showSyncDialog, setShowSyncDialog] = useState(false);
  const [hasData, setHasData] = useState(false);

  const handleSync = () => {
    setShowSyncDialog(true);
    setTimeout(() => {
      setShowSyncDialog(false);
      setHasData(true);
    }, 2000);
  };

  const handleCreate = () => {
    // Add create logic
  };

  return (
    <View style={styles.container}>
      <Header />
      <SubHeader onSync={handleSync} onCreate={handleCreate} />
      <View style={styles.content}>
        {hasData ? <EstimatesList /> : <EmptyState />}
      </View>
      <SyncDialog visible={showSyncDialog} />
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