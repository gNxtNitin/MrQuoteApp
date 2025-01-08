import { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Colors } from '@/app/constants/colors';
import { SubHeader } from './SubHeader';
import { EmptyState } from './EmptyState';
import { EstimatesList } from './EstimatesList';
import { CreateEstimateDialog } from '../estimate/CreateEstimateDialog';
import { ScreenLayout } from '@/app/components/common/ScreenLayout';
import { useTheme } from '@/app/components/providers/ThemeProvider';
import { Estimate, EstimateData } from '@/app/database/models/Estimate';
import { EstimateDetail, EstimateDetailData } from '@/app/database/models/EstimateDetail';
import { useAuth } from '@/app/hooks/useAuth';
import { useHeaderStore } from '@/app/stores/headerStore';

interface EstimateWithDetails {
  estimate: EstimateData;
  detail: EstimateDetailData;
}

export function HomeScreen() {
  const [isSyncing, setIsSyncing] = useState(false);
  const [estimates, setEstimates] = useState<EstimateWithDetails[]>([]);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const theme = useTheme();
  const { user } = useAuth();
  const { selectedCompany } = useHeaderStore();

  const loadEstimates = async () => {
    try {
      if (user?.id && selectedCompany) {
        // Get all estimates for the selected company and logged-in user
        const estimatesData = await Estimate.getByUserAndCompanyId(user.id, selectedCompany);
        
        // Get details for each estimate
        const estimatesWithDetails = await Promise.all(
          estimatesData.map(async (estimate) => {
            const detail = await EstimateDetail.getByEstimateId(estimate.id!);
            if (!detail) {
              // If no detail exists, create a default detail object
              return {
                estimate,
                detail: {
                  estimate_id: estimate.id,
                  address: '',
                  state: '',
                  zip_code: '',
                  email: '',
                  phone: '',
                  is_active: true,
                  created_by: user.id,
                  modified_by: user.id
                }
              };
            }
            return {
              estimate,
              detail
            };
          })
        );

        console.log('Loaded User Estimates:', estimatesWithDetails);
        setEstimates(estimatesWithDetails);
      }
    } catch (error) {
      console.error('Error loading estimates:', error);
      setEstimates([]);
    }
  };

  useEffect(() => {
    loadEstimates();
  }, [selectedCompany, user?.id]);

  const handleSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      loadEstimates();
    }, 2000);
  };

  const handleCreate = () => {
    setShowCreateDialog(true);
  };

  const handleSaveEstimate = async () => {
    await loadEstimates();
    setShowCreateDialog(false);
  };

  return (
    <ScreenLayout
      subHeader={<SubHeader onSync={handleSync} onCreate={handleCreate} />}
    >
      <View style={[styles.contentContainer, { backgroundColor: theme.background }]}>
        {estimates.length > 0 ? (
          <EstimatesList estimates={estimates} />
        ) : (
          <EmptyState isSyncing={isSyncing} />
        )}
      </View>

      <CreateEstimateDialog
        visible={showCreateDialog}
        onClose={() => setShowCreateDialog(false)}
        onSave={handleSaveEstimate}
        companyId={selectedCompany}
      />
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
  },
});
