import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Platform, Modal } from 'react-native';
import { Card } from '../../../common/Card';
import { Colors } from '@/app/constants/colors';
import { Input } from '../../../common/Input';
import { Button } from '../../../common/Button';
import { MaterialIcons, Feather } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';

export function WarrantyPage() {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isFormSaved, setIsFormSaved] = useState(false);
  const [showWarrantyDatePicker, setShowWarrantyDatePicker] = useState(false);
  const [showCompletionDatePicker, setShowCompletionDatePicker] = useState(false);
  const [warrantyDate, setWarrantyDate] = useState(new Date());
  const [completionDate, setCompletionDate] = useState(new Date());
  const [formData, setFormData] = useState({
    title: 'Warranty',
    warrantyStartDate: '',
    completionDate: '',
    customerName: 'Insurance Sample', // This would come from props/state in real app
    address: '123 Sample Ave NW, Calgary, AB, T2T 2T2', // This would come from props/state
  });

  const handleInputChange = (field: string, value: string) => {
    if (isFormSaved) return; // Prevent changes if form is saved
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleDateChange = (selectedDate: Date | undefined, field: string) => {
    if (selectedDate) {
      if (field === 'warrantyStartDate') {
        setWarrantyDate(selectedDate);
        handleInputChange(field, selectedDate.toLocaleDateString());
      } else {
        setCompletionDate(selectedDate);
        handleInputChange(field, selectedDate.toLocaleDateString());
      }
    }
  };

  const validateForm = () => {
    const { warrantyStartDate, completionDate } = formData;
    
    if (!warrantyStartDate) {
      Alert.alert('Error', 'Please select a warranty start date');
      return false;
    }

    if (!completionDate) {
      Alert.alert('Error', 'Please select a completion date');
      return false;
    }

    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    try {
      // Here you would typically make an API call to save the data
      console.log('Saving warranty data:', formData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setIsFormSaved(true); // Disable editing after successful save
      setIsEditingTitle(false); // Close title editing if open
      Alert.alert('Success', 'Warranty information saved successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to save warranty information. Please try again.');
      console.error('Error saving warranty data:', error);
    }
  };

  const handleLayoutPress = () => {
    // Handle layout navigation/action here
    console.log('Navigate to layouts');
  };

  const DatePickerModal = ({ 
    visible, 
    onClose, 
    date, 
    onConfirm,
    title
  }: {
    visible: boolean;
    onClose: () => void;
    date: Date;
    onConfirm: (date: Date) => void;
    title: string;
  }) => {
    const [selectedDate, setSelectedDate] = useState(date);

    return (
      <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={onClose}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{title}</Text>
            <DateTimePicker
              value={selectedDate}
              mode="date"
              display="spinner"
              onChange={(_, date) => date && setSelectedDate(date)}
              style={styles.datePicker}
            />
            <View style={styles.modalButtons}>
              <Button
                label="Cancel"
                onPress={onClose}
                variant="secondary"
                size="small"
              />
              <Button
                label="Confirm"
                onPress={() => {
                  onConfirm(selectedDate);
                  onClose();
                }}
                variant="primary"
                size="small"
              />
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  return (
    <View style={styles.container}>
      <Card style={styles.mainCard}>
        <View style={styles.header}>
          <View style={styles.titleRow}>
            {isEditingTitle && !isFormSaved ? (
              <Input
                value={formData.title}
                onChangeText={(value) => handleInputChange('title', value)}
                onBlur={() => setIsEditingTitle(false)}
                autoFocus
                style={styles.titleInput}
              />
            ) : (
              <>
                <Text style={styles.title}>{formData.title}</Text>
                {!isFormSaved && (
                  <TouchableOpacity onPress={() => setIsEditingTitle(true)}>
                    <Feather name="edit-2" size={16} color={Colors.primary} />
                  </TouchableOpacity>
                )}
              </>
            )}
          </View>
          <View style={styles.subtitleRow}>
            <Text style={styles.subtitle}>
              Warranty content can be edited in your
            </Text>
            <TouchableOpacity onPress={handleLayoutPress}>
              <Text style={styles.link}>Layouts</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.content}>
          <Text style={styles.sectionTitle}>Select the warranty start date:</Text>
          <TouchableOpacity 
            onPress={() => !isFormSaved && setShowWarrantyDatePicker(true)}
            disabled={isFormSaved}
          >
            <Input 
              placeholder="Select date"
              style={[styles.dateInput, isFormSaved && styles.disabledInput]}
              value={formData.warrantyStartDate}
              editable={false}
              pointerEvents="none"
            />
          </TouchableOpacity>

          <DatePickerModal
            visible={showWarrantyDatePicker}
            onClose={() => setShowWarrantyDatePicker(false)}
            date={warrantyDate}
            onConfirm={(date) => handleDateChange(date, 'warrantyStartDate')}
            title="Select Warranty Start Date"
          />

          <View style={styles.infoSection}>
            <View style={styles.infoGroup}>
              <Text style={styles.label}>Customer name</Text>
              <Text style={styles.value}>{formData.customerName}</Text>
            </View>

            <View style={styles.infoGroup}>
              <Text style={styles.label}>Address</Text>
              <Text style={styles.value}>{formData.address}</Text>
            </View>

            <View style={styles.infoGroup}>
              <Text style={styles.label}>Date project completed</Text>
              <TouchableOpacity 
                onPress={() => !isFormSaved && setShowCompletionDatePicker(true)}
                disabled={isFormSaved}
              >
                <Input 
                  placeholder="Select completion date"
                  style={[styles.dateInput, isFormSaved && styles.disabledInput]}
                  value={formData.completionDate}
                  editable={false}
                  pointerEvents="none"
                />
              </TouchableOpacity>

              <DatePickerModal
                visible={showCompletionDatePicker}
                onClose={() => setShowCompletionDatePicker(false)}
                date={completionDate}
                onConfirm={(date) => handleDateChange(date, 'completionDate')}
                title="Select Completion Date"
              />
            </View>
          </View>
        </View>

        <View style={styles.footer}>
          <Button
            label={isFormSaved ? "Saved" : "Save Changes"}
            onPress={handleSave}
            variant="primary"
            size="small"
            disabled={isFormSaved}
          />
        </View>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#f5f5f5',
  },
  mainCard: {
    padding: 24,
    flex: 1,
  },
  header: {
    marginBottom: 32,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  subtitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.black,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.black,
  },
  link: {
    fontSize: 14,
    color: Colors.primary,
  },
  content: {
    flex: 1,
    gap: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.black,
  },
  dateInput: {
    backgroundColor: Colors.white,
  },
  disabledInput: {
    backgroundColor: '#f5f5f5',
    opacity: 0.7,
  },
  infoSection: {
    gap: 24,
    backgroundColor: Colors.white,
    padding: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  infoGroup: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.black,
  },
  value: {
    fontSize: 14,
    color: Colors.black,
  },
  footer: {
    marginTop: 24,
    alignItems: 'flex-end',
  },
  titleInput: {
    flex: 1,
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 24,
    borderRadius: 12,
    width: '80%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    gap: 16,
  },
  datePicker: {
    width: '100%',
  },
});