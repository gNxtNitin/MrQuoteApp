import { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Colors } from '@/app/constants/colors';
import { Header } from './Header';
import { SubHeader } from './SubHeader';
import { EmptyState } from './EmptyState';
import { EstimatesList } from './EstimatesList';
import { CreateEstimateDialog } from '../estimate/CreateEstimateDialog';

export function HomeScreen() {
  const [isSyncing, setIsSyncing] = useState(false);
  const [hasData, setHasData] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  const handleSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      setHasData(true);
    }, 2000);
  };

  const handleCreate = () => {
    setShowCreateDialog(true);
  };

  const handleSaveEstimate = (data: any) => {
    // Handle saving the new estimate
    console.log('Saving estimate:', data);
    setHasData(true);
  };

  return (
    <View style={styles.container}>
      <Header />
      <SubHeader onSync={handleSync} onCreate={handleCreate} />
      <View style={styles.content}>
        {hasData ? <EstimatesList /> : <EmptyState isSyncing={isSyncing} />}
      </View>

      <CreateEstimateDialog
        visible={showCreateDialog}
        onClose={() => setShowCreateDialog(false)}
        onSave={handleSaveEstimate}
      />
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