import { View, ScrollView, StyleSheet } from 'react-native';
import { EstimateCard } from './EstimateCard';
import { Estimate, EstimateData } from '@/app/database/models/Estimate';
import { EstimateDetailData } from '@/app/database/models/EstimateDetail';
import { useState } from 'react';

type EstimateStatus = "provided" | "accepted" | "requested" | "completed" | "revised" | "cancelled";

interface EstimateWithDetails {
  estimate: EstimateData;
  detail: EstimateDetailData;
}

interface EstimatesListProps {
  estimates: EstimateWithDetails[];
}

export function EstimatesList({ estimates }: EstimatesListProps) {
  const handleStatusChange = async (estimateId: string, newStatus: EstimateStatus) => {
    try {
      // Update the estimate status in the database
      await Estimate.update(parseInt(estimateId, 10), {
        estimate_status: newStatus,
        modified_date: new Date().toISOString()
      });
      
      return Promise.resolve();
    } catch (error) {
      console.error('Failed to update status:', error);
      return Promise.reject(error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        {estimates.map((item, index) => (
          <EstimateCard
            key={item.estimate.id}
            estimate={{
              id: item.estimate.id?.toString() || '',
              customerName: `${item.estimate.estimate_name || 'Unknown'}`,
              address: `${item.detail.address || ''}, ${item.detail.state || ''} ${item.detail.zip_code || ''}`,
              date: `Created ${new Date(item.estimate.created_date || '').toLocaleDateString()}`,
              estimateStatus: item.estimate.estimate_status as EstimateStatus || 'provided',
              email: item.detail.email || '',  // Add if needed from detail
              phone: item.detail.phone || '', // Add if needed from detail
              houseImage: item.detail.image_url ? require('@/assets/images/house-1.jpg') : require('@/assets/images/house-2.jpg'),
            }}
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
    justifyContent: 'flex-start',
    gap: 16,
  },
}); 