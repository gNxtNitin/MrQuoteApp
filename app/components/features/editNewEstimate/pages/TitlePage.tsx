import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Input } from '../../../common/Input';
import { Card } from '../../../common/Card';
import { Button } from '../../../common/Button';
import { Colors } from '@/app/constants/colors';
import { ImageUploader } from '../../../common/ImageUploader';

export function TitlePage() {
  const handleSave = () => {
    // TODO: Implement save functionality
    console.log('Saving changes...');
  };

  const handlePrimaryImageUpload = () => {
    // TODO: Implement image upload
    console.log('Uploading primary image...');
  };

  const handleSecondaryImageUpload = () => {
    // TODO: Implement image upload
    console.log('Uploading secondary image...');
  };

  return (
    <View style={styles.container}>
      <Card style={styles.mainCard}>
        <ScrollView 
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.formContainer}>
            {/* Title Section */}
            <View style={styles.titleContainer}>
              <Text style={styles.label}>Title</Text>
              <Input 
                placeholder="Enter title"
                style={styles.titleInput}
              />
            </View>

            {/* Report Type and Date Row */}
            <View style={styles.row}>
              <View style={styles.column}>
                <Text style={styles.label}>Report type</Text>
                <Input placeholder="Select report type" />
              </View>
              <View style={styles.column}>
                <Text style={styles.label}>Date</Text>
                <Input placeholder="Select date" />
              </View>
            </View>

            {/* Image Upload Row */}
            <View style={styles.row}>
              <ImageUploader 
                label="Primary Image"
                onUpload={handlePrimaryImageUpload}
              />
              <ImageUploader 
                label="Certification/Secondary Logo"
                onUpload={handleSecondaryImageUpload}
              />
            </View>

            {/* Rest of the form... */}
            {/* ... */}

            {/* Save Button at the end */}
            <View style={styles.buttonContainer}>
              <Button 
                label="Save Changes"
                onPress={handleSave}
                variant="primary"
                size="small"
              />
            </View>
          </View>
        </ScrollView>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 24,
  },
  mainCard: {
    padding: 24,
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  formContainer: {
    gap: 24,
  },
  titleContainer: {
    marginBottom: 16,
  },
  titleInput: {
    width: '100%',
  },
  row: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
  },
  column: {
    flex: 1,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
    color: '#333',
  },
  buttonContainer: {
    alignItems: 'flex-end',
    marginTop: 8,
  },
});