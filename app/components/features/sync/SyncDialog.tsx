import { View, Text, Modal, StyleSheet, Image } from 'react-native';
import { Colors } from '@/app/constants/colors';

interface SyncDialogProps {
  visible: boolean;
}

export function SyncDialog({ visible }: SyncDialogProps) {
  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
    >
      <View style={styles.overlay}>
        <View style={styles.dialog}>
          <Image 
            source={require('@/assets/images/sync-animation.gif')}
            style={styles.syncGif}
            resizeMode="contain"
          />
          <Text style={styles.title}>Syncing data from Service Fusion...</Text>
          <Text style={styles.subtitle}>
            Updating your information now—this will only take a moment.
          </Text>
        </View>
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
  },
  dialog: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 24,
    width: '90%',
    maxWidth: 400,
    alignItems: 'center',
  },
  syncGif: {
    width: 120,
    height: 120,
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.primary,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
}); 