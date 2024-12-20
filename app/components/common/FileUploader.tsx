import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Card } from './Card';
import { MaterialIcons, Feather } from '@expo/vector-icons';
import { Colors } from '@/app/constants/colors';

interface FileUploaderProps {
  label?: string;
  subtitle?: string;
  accept?: 'image' | 'pdf' | 'both';
  height?: number;
  onUpload?: () => void;
  showBorder?: boolean;
  variant?: 'solid' | 'dashed';
}

export function FileUploader({ 
  label, 
  subtitle,
  accept = 'both',
  height = 180,
  onUpload,
  showBorder = true,
  variant = 'dashed'
}: FileUploaderProps) {
  const getIcon = () => {
    if (accept === 'image') {
      return <MaterialIcons name="image" size={24} color={Colors.primary} />;
    } else if (accept === 'pdf') {
      return <MaterialIcons name="picture-as-pdf" size={24} color={Colors.primary} />;
    }
    return <Feather name="upload-cloud" size={24} color={Colors.primary} />;
  };

  const getUploadText = () => {
    if (accept === 'image') return 'Upload image';
    if (accept === 'pdf') return 'Upload PDF';
    return 'Upload file';
  };

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TouchableOpacity onPress={onUpload} style={styles.touchable}>
        <View style={[
          styles.uploadContainer,
          showBorder && styles.border,
          variant === 'dashed' && styles.dashedBorder,
          { height }
        ]}>
          <Card variant="outlined" style={[styles.uploadCard, variant === 'dashed' && styles.dashedCard]}>
            {getIcon()}
            <Text style={styles.uploadText}>{getUploadText()}</Text>
            {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
          </Card>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
    color: '#333',
  },
  touchable: {
    flex: 1,
  },
  uploadContainer: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 14,
  },
  border: {
    borderWidth: 1,
    borderColor: Colors.gradientPrimary + '40',
  },
  dashedBorder: {
    borderStyle: 'dashed',
  },
  uploadCard: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  dashedCard: {
    borderStyle: 'dashed',
    borderColor: Colors.primary,
  },
  uploadText: {
    color: '#666',
    fontSize: 14,
    marginTop: 8,
  },
  subtitle: {
    color: Colors.gray[500],
    fontSize: 12,
    marginTop: 4,
    textAlign: 'center',
  }
}); 