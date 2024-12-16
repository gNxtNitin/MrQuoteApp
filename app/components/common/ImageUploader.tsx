import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card } from './Card';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors } from '@/app/constants/colors';

interface ImageUploaderProps {
  label: string;
  onUpload?: () => void;
}

export function ImageUploader({ label, onUpload }: ImageUploaderProps) {
  return (
    <View style={styles.column}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.uploadContainer}>
        <Card variant="outlined" style={styles.uploadCard}>
          <MaterialIcons name="cloud-upload" size={24} color={Colors.primary} />
          <Text style={styles.uploadText}>Upload image</Text>
        </Card>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  column: {
    flex: 1,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
    color: '#333',
  },
  uploadCard: {
    height: 180,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderStyle: 'dashed',
    borderColor: Colors.primary,
  },
  uploadContainer: {
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.gradientPrimary + '40',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 14,
    borderStyle: 'solid',
  },
  uploadText: {
    color: '#666',
    fontSize: 14,
  },
}); 