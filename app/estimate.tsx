import { EstimateScreen } from '@/app/components/features/estimate/EstimateScreen';
import { useLocalSearchParams } from 'expo-router';

export default function EstimatePage() {
  const { estimateData } = useLocalSearchParams();
  const estimate = JSON.parse(estimateData as string);

  return <EstimateScreen estimateData={estimate} />;
}
