import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Input } from '../../../common/Input';
import { Card } from '../../../common/Card';
import { Button } from '../../../common/Button';
import { Colors } from '@/app/constants/colors';
import { Feather, MaterialIcons } from '@expo/vector-icons';
import { FileUploader } from '@/app/components/common/FileUploader';

export function TitlePage() {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [title, setTitle] = useState('Title');

  const handleSave = () => {
    // TODO: Implement save functionality
    console.log('Saving changes...');
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
              <View style={styles.titleRow}>
                {isEditingTitle ? (
                  <Input
                    value={title}
                    onChangeText={setTitle}
                    onBlur={() => setIsEditingTitle(false)}
                    autoFocus
                    style={styles.titleInput}
                  />
                ) : (
                  <>
                    <Text style={styles.titleText}>{title}</Text>
                    <TouchableOpacity onPress={() => setIsEditingTitle(true)}>
                      <Feather name="edit-2" size={16} color={Colors.primary} />
                    </TouchableOpacity>
                  </>
                )}
              </View>
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
              <FileUploader
                label="Primary Image"
                accept="image"
                onUpload={() => console.log('Upload primary image')}
              />
              <FileUploader
                label="Certification/Secondary Logo"
                accept="image"
                onUpload={() => console.log('Upload secondary image')}
              />
            </View>

            {/* Name Row */}
            <View style={styles.row}>
              <View style={styles.column}>
                <Text style={styles.label}>First name</Text>
                <Input placeholder="Enter first name" />
              </View>
              <View style={styles.column}>
                <Text style={styles.label}>Last name</Text>
                <Input placeholder="Enter last name" />
              </View>
            </View>

            {/* Company and Address Row */}
            <View style={styles.row}>
              <View style={styles.column}>
                <Text style={styles.label}>Company name</Text>
                <Input placeholder="Enter company name" />
              </View>
              <View style={styles.column}>
                <Text style={styles.label}>Address</Text>
                <Input placeholder="Enter address" />
              </View>
            </View>

            {/* Location Row */}
            <View style={styles.row}>
              <View style={[styles.column, { flex: 0.5 }]}>
                <Text style={styles.label}>City</Text>
                <Input placeholder="Enter city" />
              </View>
              <View style={[styles.column, { flex: 0.5 }]}>
                <View style={styles.row}>
                  <View style={styles.column}>
                    <Text style={styles.label}>State/Province</Text>
                    <Input placeholder="Enter state/province" />
                  </View>
                  <View style={styles.column}>
                    <Text style={styles.label}>Zip code/Postal code</Text>
                    <Input placeholder="Enter zip/postal code" />
                  </View>
                </View>
              </View>
            </View>

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
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  titleText: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.black,
  },
  titleInput: {
    flex: 1,
    fontSize: 20,
    fontWeight: '600',
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
    borderColor: Colors.gradientPrimary + '40', // 20 is hex for 12% opacity
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
  buttonContainer: {
    alignItems: 'flex-end',
    marginTop: 4,
  },
}); 