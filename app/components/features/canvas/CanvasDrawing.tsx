import { View, StyleSheet, Pressable, SafeAreaView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import CanvasDrawingApp from './CanvasDrawingApp';

interface CanvasDrawingProps {
  onClose: () => void;
  isDarkMode: boolean;
}

export function CanvasDrawing({ onClose, isDarkMode }: CanvasDrawingProps) {
  return (
    <SafeAreaView style={[
      styles.safeArea,
      { backgroundColor: isDarkMode ? '#1a1a1a' : '#fff' }
    ]}>
      <View style={styles.container}>
        <Pressable 
          style={styles.closeButton} 
          onPress={onClose}
        >
          <MaterialIcons 
            name="close" 
            size={24} 
            color={isDarkMode ? '#fff' : '#000'} 
          />
        </Pressable>
        <CanvasDrawingApp />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  closeButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    zIndex: 1,
    padding: 8,
    borderRadius: 60,
    backgroundColor: 'rgba(200, 200, 200, 0.8)',
  },
}); 