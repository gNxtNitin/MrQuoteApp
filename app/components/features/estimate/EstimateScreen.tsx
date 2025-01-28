import { View, StyleSheet, ScrollView } from 'react-native';
import { Colors } from '@/app/constants/colors';
import { EstimateSubHeader } from './EstimateSubHeader';
import { EstimateDetails } from './EstimateDetails';
import { Estimate } from '@/app/types/estimate';
import { ScreenLayout } from '@/app/components/common/ScreenLayout';
import { router } from 'expo-router';
import { useTheme } from '../../providers/ThemeProvider';

interface EstimateScreenProps {
  estimateData: Estimate;
}

export function EstimateScreen({ 
  estimateData }: EstimateScreenProps) {
  const theme = useTheme();
  
  const handleEditEstimate = () => {
    router.push('/editEstimate');
  };
  return (
    <ScreenLayout
      subHeader={<EstimateSubHeader {...estimateData} />}
    >
      <ScrollView style={[styles.content, { backgroundColor: theme.background }]}>
        <View style={styles.contentWrapper}>
          <EstimateDetails estimate={estimateData} onEdit={handleEditEstimate} />
        </View>
      </ScrollView>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    padding: 24,
  },
  contentWrapper: {
    maxWidth: 1200,
    marginHorizontal: 'auto',
  },
}); 