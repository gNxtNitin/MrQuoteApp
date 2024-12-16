import { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Colors } from '@/app/constants/colors';
import { SubHeader } from './SubHeader';
import { EmptyState } from './EmptyState';
import { EstimatesList } from './EstimatesList';
import { CreateEstimateDialog } from '../estimate/CreateEstimateDialog';
import { ScreenLayout } from '@/app/components/common/ScreenLayout';
import { useTheme } from '@/app/components/providers/ThemeProvider';

export function HomeScreen() {
  const [isSyncing, setIsSyncing] = useState(false);
  const [hasData, setHasData] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const theme = useTheme();

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
    <ScreenLayout
      subHeader={<SubHeader onSync={handleSync} onCreate={handleCreate} />}
    >
      <View style={[styles.contentContainer, { backgroundColor: theme.background }]}>
        {hasData ? (
          <EstimatesList />
        ) : (
          <EmptyState isSyncing={isSyncing} />
        )}
      </View>

      <CreateEstimateDialog
        visible={showCreateDialog}
        onClose={() => setShowCreateDialog(false)}
        onSave={handleSaveEstimate}
      />
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
  },
}); 