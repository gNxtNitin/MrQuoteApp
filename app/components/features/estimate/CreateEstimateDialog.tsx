import { View, Text, TextInput, StyleSheet, Modal, Pressable } from 'react-native';
import { Colors } from '@/app/constants/colors';
import { Card } from '@/app/components/common/Card';

interface CreateEstimateDialogProps {
  visible: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
}

export function CreateEstimateDialog({ visible, onClose, onSave }: CreateEstimateDialogProps) {
  const handleSave = () => {
    // Add validation and data collection logic here
    onSave({});
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Card>
          <View style={styles.container}>
            <View style={styles.header}>
              <Text style={styles.title}>Create New Estimate</Text>
              <Pressable onPress={onClose} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>✕</Text>
              </Pressable>
            </View>
            <View style={styles.divider} />

            <View style={styles.form}>
              <View style={styles.row}>
                <View style={styles.field}>
                  <Text style={styles.label}>Project No.</Text>
                  <TextInput style={styles.input} placeholder="Enter project number" placeholderTextColor="#999" />
                </View>
                <View style={styles.field}>
                  <Text style={styles.label}>First name</Text>
                  <TextInput style={styles.input} placeholder="Enter first name" placeholderTextColor="#999" />
                </View>
                <View style={styles.field}>
                  <Text style={styles.label}>Last name</Text>
                  <TextInput style={styles.input} placeholder="Enter last name" placeholderTextColor="#999" />
                </View>
              </View>

              <View style={styles.row}>
                <View style={styles.field}>
                  <Text style={styles.label}>Company name</Text>
                  <TextInput style={styles.input} placeholder="Enter company name" placeholderTextColor="#999" />
                </View>
                <View style={styles.field}>
                  <Text style={styles.label}>Phone number</Text>
                  <TextInput 
                    style={styles.input} 
                    placeholder="Enter phone number"
                    placeholderTextColor="#999"
                    keyboardType="phone-pad"
                  />
                </View>
                <View style={styles.field}>
                  <Text style={styles.label}>Email</Text>
                  <TextInput 
                    style={styles.input} 
                    placeholder="Enter email"
                    placeholderTextColor="#999"
                    keyboardType="email-address"
                  />
                </View>
              </View>

              <View style={styles.row}>
                <View style={styles.field}>
                  <Text style={styles.label}>Address line 1</Text>
                  <TextInput style={styles.input} placeholder="Enter address" placeholderTextColor="#999" />
                </View>
                <View style={styles.field}>
                  <Text style={styles.label}>Address line 2</Text>
                  <TextInput style={styles.input} placeholder="Enter address" placeholderTextColor="#999" />
                </View>
                <View style={styles.field}>
                  <Text style={styles.label}>City</Text>
                  <TextInput style={styles.input} placeholder="Enter city" placeholderTextColor="#999" />
                </View>
              </View>

              <View style={[styles.row, styles.lastRow]}>
                <View style={styles.field}>
                  <Text style={styles.label}>State/Province</Text>
                  <TextInput style={styles.input} placeholder="Enter state" placeholderTextColor="#999" />
                </View>
                <View style={styles.field}>
                  <Text style={styles.label}>Zip code/Postal code</Text>
                  <TextInput 
                    style={styles.input} 
                    placeholder="Enter zip code"
                    placeholderTextColor="#999"
                    keyboardType="numeric"
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
}); 