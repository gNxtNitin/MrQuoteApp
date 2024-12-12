import { View, Text, Pressable, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors } from '@/app/constants/colors';

interface ActionButtonsProps {
  onSync: () => void;
  onCreate: () => void;
}

export function ActionButtons({ onSync, onCreate }: ActionButtonsProps) {
  return (
    <View style={styles.container}>
      <Pressable style={styles.createButton} onPress={onCreate}>
        <MaterialIcons name="add" size={24} color={Colors.primary} />
        <Text style={styles.createButtonText}>Create</Text>
      </Pressable>
      
      <Pressable style={styles.syncButton} onPress={onSync}>
        <MaterialIcons name="sync" size={24} color={Colors.white} />
        <Text style={styles.syncButtonText}>Sync</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 12,
    marginHorizontal: 20,
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  syncButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  createButtonText: {
    color: Colors.primary,
    fontSize: 16,
    fontWeight: '600',
  },
  syncButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
}); 