import { View, ScrollView, StyleSheet } from 'react-native';
import { EstimateCard } from './EstimateCard';

const MOCK_DATA = [
  {
    id: '1',
    customerName: 'John Doe',
    address: '123 Main St, City, State',
    date: 'Created 1 year ago',
    status: 'provided' as const,
  },
  {
    id: '2',
    customerName: 'Jane Smith',
    address: '456 Oak Ave, Town, State',
    date: 'Created 1 year ago',
    status: 'requested' as const,
  },
  {
    id: '3',
    customerName: 'Bob Johnson',
    address: '789 Pine Rd, Village, State',
    date: 'Created 1 year ago',
    status: 'accepted' as const,
  },
  {
    id: '4',
    customerName: 'John Doe',
    address: '123 Main St, City, State',
    date: 'Created 1 year ago',
    status: 'provided' as const,
  },
  {
    id: '5',
    customerName: 'Jane Smith',
    address: '456 Oak Ave, Town, State',
    date: 'Created 1 year ago',
    status: 'requested' as const,
  },
  {
    id: '6',
    customerName: 'Bob Johnson',
    address: '789 Pine Rd, Village, State',
    date: 'Created 1 year ago',
    status: 'accepted' as const,
  },
  // Add more mock data as needed
];

export function EstimatesList() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        {MOCK_DATA.map((estimate) => (
          <EstimateCard
                key={estimate.id}
                customerName={estimate.customerName}
                address={estimate.address}
                date={estimate.date}
                status={estimate.status} index={0}          />
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
  content: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
}); 