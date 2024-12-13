import { View, StyleSheet, ScrollView } from 'react-native';
import { Colors } from '@/app/constants/colors';
import { Header } from '../home/Header';
import { EstimateSubHeader } from './EstimateSubHeader';
import { EstimateDetails } from './EstimateDetails';
import { Estimate } from '@/app/types/estimate';

interface EstimateScreenProps {
  estimateData: Estimate;
}

export function EstimateScreen({ estimateData }: EstimateScreenProps) {
  return (
    <View style={styles.container}>
      <Header />
      <EstimateSubHeader {...estimateData} />
      <ScrollView style={styles.content}>
        <View style={styles.contentWrapper}>
          <EstimateDetails estimate={estimateData} />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  content: {
    flex: 1,
    padding: 24,
  },
  contentWrapper: {
    maxWidth: 1200,
    marginHorizontal: 'auto',
  },
}); 