import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '@/app/constants/colors';
import { router } from 'expo-router';
import { Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

export function SubHeader() {
  const handleBack = () => router.back();

  return (
    <View style={styles.container}>
                <Pressable style={styles.backButton} onPress={handleBack}>
            <MaterialIcons name="arrow-back" size={20} color={Colors.primary} />
            <Text style={styles.backText}>Back</Text>
          </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  backButton: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  backText: { fontSize: 16, color: Colors.primary, fontWeight: '600' },
}); 