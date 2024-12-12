import { View, StyleSheet, Pressable, Text, SafeAreaView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

interface HomePageProps {
  onOpenCanvas: () => void;
  onToggleTheme: () => void;
  isDarkMode: boolean;
}

export function HomePage({ onOpenCanvas, onToggleTheme, isDarkMode }: HomePageProps) {
  return (
    <SafeAreaView style={[
      styles.safeArea,
      { backgroundColor: isDarkMode ? '#1a1a1a' : '#fff' }
    ]}>
      <View style={styles.container}>
        <Pressable 
          style={[styles.button, styles.canvasButton]} 
          onPress={onOpenCanvas}
        >
          <MaterialIcons name="brush" size={24} color="#fff" />
          <Text style={styles.buttonText}>Open Canvas</Text>
        </Pressable>

        <Pressable 
          style={[styles.button, styles.themeButton]} 
          onPress={onToggleTheme}
        >
          <MaterialIcons 
            name={isDarkMode ? 'light-mode' : 'dark-mode'} 
            size={24} 
            color="#fff" 
          />
          <Text style={styles.buttonText}>
            Switch to {isDarkMode ? 'Light' : 'Dark'} Mode
          </Text>
        </Pressable>
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
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 10,
    gap: 10,
  },
  canvasButton: {
    backgroundColor: '#007AFF',
  },
  themeButton: {
    backgroundColor: '#FF9500',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
}); 