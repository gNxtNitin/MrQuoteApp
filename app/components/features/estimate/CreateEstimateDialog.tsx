import { View, Text, TextInput, StyleSheet, Modal, Pressable, Alert } from 'react-native';
import { Colors } from '@/app/constants/colors';
import { Card } from '@/app/components/common/Card';
import { useState } from 'react';
import { useTheme } from '../../providers/ThemeProvider';
import { Estimate } from '@/app/database/models/Estimate';
import { EstimateDetail } from '@/app/database/models/EstimateDetail';
import { useAuth } from '@/app/hooks/useAuth';

interface CreateEstimateDialogProps {
  visible: boolean;
  onClose: () => void;
  onSave: () => void;
  companyId: number;
}

interface EstimateFormData {
  projectName: string;
  firstName: string;
  lastName: string;
  companyName: string;
  phoneNumber: string;
  email: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  zipCode: string;
}

interface ValidationErrors {
  [key: string]: string;
}

export function CreateEstimateDialog({ visible, onClose, onSave, companyId }: CreateEstimateDialogProps) {
  const theme = useTheme();
  const { user } = useAuth();
  const [formData, setFormData] = useState<EstimateFormData>({
    projectName: '',
    firstName: '',
    lastName: '',
    companyName: '',
    phoneNumber: '',
    email: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    zipCode: '',
  });
  const [errors, setErrors] = useState<ValidationErrors>({});

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};
    
    if (!formData.projectName.trim()) {
      newErrors.projectName = 'Project name is required';
    }
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    
    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required';
    } else if (!/^\d{10}$/.test(formData.phoneNumber.replace(/\D/g, ''))) {
      newErrors.phoneNumber = 'Invalid phone number format';
    }
    
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    
    if (!formData.addressLine1.trim()) {
      newErrors.addressLine1 = 'Address is required';
    }
    
    if (!formData.city.trim()) {
      newErrors.city = 'City is required';
    }
    
    if (!formData.state.trim()) {
      newErrors.state = 'State is required';
    }
    
    if (!formData.zipCode.trim()) {
      newErrors.zipCode = 'ZIP code is required';
    } else if (!/^\d{5}(-\d{4})?$/.test(formData.zipCode)) {
      newErrors.zipCode = 'Invalid ZIP code format';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      Alert.alert('Validation Error', 'Please check the form for errors');
      return;
    }

    try {
      if (!user?.id) {
        throw new Error('User not found');
      }

      // Create estimate record
      const estimateData = {
        company_id: companyId,
        estimate_name: formData.projectName,
        description: `Estimate for ${formData.firstName} ${formData.lastName}`,
        estimate_status: 'NEW',
        is_active: true,
        created_by: user.id,
        modified_by: user.id
      };

      await Estimate.insert(estimateData);
      const { id: estimateId } = await Estimate.getLastInsertedId();

      if (!estimateId) {
        throw new Error('Failed to get estimate ID');
      }

      // Create estimate detail record
      const estimateDetailData = {
        estimate_id: estimateId,
        sales_person: `${user.first_name || ''} ${user.last_name || ''}`.trim(),
        address: `${formData.addressLine1} ${formData.addressLine2}`.trim(),
        state: formData.state,
        zip_code: formData.zipCode,
        is_active: true,
        created_by: user.id,
        modified_by: user.id
      };

      await EstimateDetail.insert(estimateDetailData);

      onSave();
      onClose();
      setFormData({
        projectName: '',
        firstName: '',
        lastName: '',
        companyName: '',
        phoneNumber: '',
        email: '',
        addressLine1: '',
        addressLine2: '',
        city: '',
        state: '',
        zipCode: '',
      });
    } catch (error) {
      console.error('Error saving estimate:', error);
      Alert.alert('Error', 'Failed to save estimate. Please try again.');
    }
  };

  const handleChange = (field: keyof EstimateFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Card style={{ backgroundColor: theme.background }}>
          <View style={styles.container}>
            <View style={styles.header}>
              <Text style={[styles.title, { color: theme.primary }]}>Create New Estimate</Text>
              <Pressable onPress={onClose} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>✕</Text>
              </Pressable>
            </View>
            <View style={[styles.divider, { backgroundColor: theme.border }]} />

            <View style={styles.form}>
              <View style={styles.row}>
                <View style={styles.field}>
                  <Text style={styles.label}>Project Name</Text>
                  <TextInput 
                    style={[
                      styles.input, 
                      { 
                        borderColor: errors.projectName ? Colors.error : theme.border,
                        backgroundColor: theme.background,
                        color: theme.textSecondary
                      }
                    ]}
                    placeholder="Enter project name" 
                    placeholderTextColor={theme.secondary}
                    value={formData.projectName}
                    onChangeText={(value) => handleChange('projectName', value)}
                  />
                  {errors.projectName && (
                    <Text style={styles.errorText}>{errors.projectName}</Text>
                  )}
                </View>
                <View style={styles.field}>
                  <Text style={styles.label}>First name</Text>
                  <TextInput 
                    style={[styles.input, { 
                      borderColor: theme.border,
                      backgroundColor: theme.background,
                      color: theme.textSecondary  
                    }]}
                    placeholder="Enter first name" 
                    placeholderTextColor={theme.secondary}
                    value={formData.firstName}
                    onChangeText={(value) => handleChange('firstName', value)}
                  />
                </View>
                <View style={styles.field}>
                  <Text style={styles.label}>Last name</Text>
                  <TextInput 
                    style={[styles.input, { 
                      borderColor: theme.border,
                      backgroundColor: theme.background,
                      color: theme.textSecondary    
                    }]}
                    placeholder="Enter last name" 
                    placeholderTextColor={theme.secondary}
                    value={formData.lastName}
                    onChangeText={(value) => handleChange('lastName', value)}
                  />
                </View>
              </View>

              <View style={styles.row}>
                <View style={styles.field}>
                  <Text style={styles.label}>Company name</Text>
                  <TextInput 
                    style={[styles.input, { 
                      borderColor: theme.border,
                      backgroundColor: theme.background,
                      color: theme.textSecondary  
                    }]}
                    placeholder="Enter company name" 
                    placeholderTextColor={theme.secondary}
                    value={formData.companyName}
                    onChangeText={(value) => handleChange('companyName', value)}
                  />
                </View>
                <View style={styles.field}>
                  <Text style={styles.label}>Phone number</Text>
                  <TextInput 
                    style={[styles.input, { 
                      borderColor: theme.border,
                      backgroundColor: theme.background,
                      color: theme.textSecondary  
                    }]}
                    placeholder="Enter phone number" 
                    placeholderTextColor={theme.secondary}
                    keyboardType="phone-pad"
                    value={formData.phoneNumber}
                    onChangeText={(value) => handleChange('phoneNumber', value)}
                  />
                </View>
                <View style={styles.field}>
                  <Text style={styles.label}>Email</Text>
                  <TextInput 
                    style={[styles.input, { 
                      borderColor: theme.border,
                      backgroundColor: theme.background,
                      color: theme.textSecondary
                    }]}
                    placeholder="Enter email" 
                    placeholderTextColor={theme.secondary}
                    keyboardType="email-address"
                    value={formData.email}
                    onChangeText={(value) => handleChange('email', value)}
                  />
                </View>
              </View>

              <View style={styles.row}>
                <View style={styles.field}>
                  <Text style={styles.label}>Address line 1</Text>
                  <TextInput 
                    style={[styles.input, { 
                      borderColor: theme.border,
                      backgroundColor: theme.background,
                      color: theme.textSecondary
                    }]}
                    placeholder="Enter address" 
                    placeholderTextColor={theme.secondary}
                    value={formData.addressLine1}
                    onChangeText={(value) => handleChange('addressLine1', value)}
                  />
                </View>
                <View style={styles.field}>
                  <Text style={styles.label}>Address line 2</Text>
                  <TextInput 
                    style={[styles.input, { 
                      borderColor: theme.border,
                      backgroundColor: theme.background,
                      color: theme.textSecondary
                    }]}
                    placeholder="Enter address" 
                    placeholderTextColor={theme.secondary}
                    value={formData.addressLine2}
                    onChangeText={(value) => handleChange('addressLine2', value)}
                  />
                </View>
                <View style={styles.field}>
                  <Text style={styles.label}>City</Text>
                  <TextInput 
                    style={[styles.input, { 
                      borderColor: theme.border,
                      backgroundColor: theme.background,
                      color: theme.textSecondary
                    }]}
                    placeholder="Enter city" 
                    placeholderTextColor={theme.secondary}
                    value={formData.city}
                    onChangeText={(value) => handleChange('city', value)}
                  />
                </View>
              </View>

              <View style={[styles.row, styles.lastRow]}>
                <View style={styles.field}>
                  <Text style={styles.label}>State/Province</Text>
                  <TextInput 
                    style={[styles.input, { 
                      borderColor: theme.border,
                      backgroundColor: theme.background,
                      color: theme.textSecondary
                    }]}
                    placeholder="Enter state" 
                    placeholderTextColor={theme.secondary}
                    value={formData.state}
                    onChangeText={(value) => handleChange('state', value)}
                  />
                </View>
                <View style={styles.field}>
                  <Text style={styles.label}>Zip code/Postal code</Text>
                  <TextInput 
                    style={[styles.input, { 
                      borderColor: theme.border,
                      backgroundColor: theme.background,
                      color: theme.textSecondary
                    }]}
                    placeholder="Enter zip code" 
                    placeholderTextColor={theme.secondary}
                    keyboardType="numeric"
                    value={formData.zipCode}
                    onChangeText={(value) => handleChange('zipCode', value)}
                  />
                </View>
                <View style={styles.field} />
              </View>
            </View>

            <View style={styles.footer}>
              <Pressable style={styles.cancelButton} onPress={onClose}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </Pressable>
              <Pressable style={styles.saveButton} onPress={handleSave}>
                <Text style={styles.saveButtonText}>SAVE</Text>
              </Pressable>
            </View>
          </View>
        </Card>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '10%',
  },
  container: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  closeButton: {
    padding: 8,
  },
  closeButtonText: {
    fontSize: 20,
    color: '#666',
  },
  form: {
    gap: 16,
  },
  row: {
    flexDirection: 'row',
    gap: 16,
  },
  lastRow: {
    marginBottom: 24,
  },
  field: {
    flex: 1,
  },
  label: {
    fontSize: 14,
    color: '#000',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    marginTop: 24,
  },
  cancelButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  cancelButtonText: {
    color: Colors.primary,
    fontSize: 16,
    fontWeight: '600',
  },
  saveButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  saveButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: '#eee',
    marginLeft: 0,
    marginRight: 0,
    marginBottom: 24
  },
  errorText: {
    color: Colors.error,
    fontSize: 12,
    marginTop: 4,
  }
}); 