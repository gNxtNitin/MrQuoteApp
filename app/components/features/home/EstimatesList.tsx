import { View, ScrollView, StyleSheet } from 'react-native';
import { EstimateCard } from './EstimateCard';
import { Estimate } from '@/app/types/estimate';
import { useState } from 'react';

const INITIAL_DATA: Estimate[] = [
  {
    id: '1',
    customerName: 'John Doe',
    address: '123 Main St, City, State',
    date: 'Created 1 year ago',
    status: 'provided',
    email: 'john.doe@example.com',
    phone: '(555) 123-4567',
    houseImage: require('@/assets/images/house-1.jpg'),
  },
  {
    id: '2',
    customerName: 'Jane Smith',
    address: '456 Oak Ave, Town, State',
    date: 'Created 1 year ago',
    status: 'requested',
    email: 'jane.smith@example.com',
    phone: '(555) 234-5678',
    houseImage: require('@/assets/images/house-2.jpg'),
  },
  {
    id: '3',
    customerName: 'Bob Johnson',
    address: '789 Pine Rd, Village, State',
    date: 'Created 1 year ago',
    status: 'accepted',
    email: 'bob.johnson@example.com',
    phone: '(555) 345-6789',
    houseImage: require('@/assets/images/house-3.jpg'),
  },
  {
    id: '4',
    customerName: 'Alice Brown',
    address: '321 Elm St, City, State',
    date: 'Created 1 year ago',
    status: 'completed',
    email: 'alice.brown@example.com',
    phone: '(555) 456-7890',
    houseImage: require('@/assets/images/house-2.jpg'),
  },
  {
    id: '5',
    customerName: 'Charlie Wilson',
    address: '654 Maple Ave, Town, State',
    date: 'Created 1 year ago',
    status: 'revised',
    email: 'charlie.wilson@example.com',
    phone: '(555) 567-8901',
    houseImage: require('@/assets/images/house-1.jpg'),
  },
  {
    id: '6',
    customerName: 'David Miller',
    address: '987 Cedar Rd, Village, State',
    date: 'Created 1 year ago',
    status: 'cancelled',
    email: 'david.miller@example.com',
    phone: '(555) 678-9012',
    houseImage: require('@/assets/images/house-3.jpg'),
    },
];

export function EstimatesList() {
  const [estimates, setEstimates] = useState<Estimate[]>(INITIAL_DATA);

  const handleStatusChange = async (estimateId: string, newStatus: Estimate['status']) => {
    try {
      // Update the estimates state
      setEstimates(prevEstimates =>
        prevEstimates.map(estimate =>
          estimate.id === estimateId
            ? { ...estimate, status: newStatus }
            : estimate
        )
      );
      
      // Here you would typically make an API call to update the backend
      // await updateEstimateStatus(estimateId, newStatus);
      
      return Promise.resolve();
    } catch (error) {
      console.error('Failed to update status:', error);
      return Promise.reject(error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        {estimates.map((estimate, index) => (
          <EstimateCard
            key={estimate.id}
            estimate={estimate}
            index={index}
            onStatusChange={handleStatusChange}
          />
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