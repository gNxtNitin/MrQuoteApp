import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '@/app/constants/colors';
import { router } from 'expo-router';
import { Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Button } from '../../common/Button';

export function SubHeader() {
  const handleBack = () => router.back();
  const handleViewPage = () => {
    // Handle view page action
  };

  return (
    <View style={styles.container}>
      <View style={styles.leftSection}>
        <Pressable style={styles.backButton} onPress={handleBack}>
          <MaterialIcons name="arrow-back" size={20} color={Colors.primary} />
          <Text style={styles.backText}>Back</Text>
        </Pressable>
        <View style={styles.estimateInfo}>
          <Text style={styles.estimateName}>Estimate #1234</Text>
          <Text style={styles.layoutText}>Layout: Default Layout</Text>
        </View>
      </View>
      <Button 
                label="View Page"
                onPress={handleViewPage}
                variant="primary"
                size="medium"
              />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  leftSection: {
    flex: 1,
    gap: 8,
  },
  estimateInfo: {
    marginTop: 4,
  },
  estimateName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  layoutText: {
    fontSize: 14,
    color: Colors.black,
    opacity: 0.7,
  },
  backButton: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 6 
  },
  backText: { 
    fontSize: 16, 
    color: Colors.primary, 
    fontWeight: '600' 
  },
  viewButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  viewButtonText: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: '600',
  },
}); 