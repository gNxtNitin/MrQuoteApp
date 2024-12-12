import { View, StyleSheet, SafeAreaView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';

const icons: string[] = [
  'brush' as const,
  'palette' as const,
  'color-lens' as const,
  'edit' as const,
  'create' as const,
  'gesture' as const,
  'format-paint' as const,
  'border-color' as const
];

export function SplashScreen() {
  const [randomIcon, setRandomIcon] = useState('');

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * icons.length);
    setRandomIcon(icons[randomIndex]);
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <MaterialIcons 
          name={randomIcon as keyof typeof MaterialIcons.glyphMap} 
          size={100} 
          color="#000" 
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
}); 