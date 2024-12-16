import { Stack } from "expo-router";
import { useEffect } from "react";
import { StatusBar, StyleSheet, View } from 'react-native';
import { lockLandscapeOrientation, preventOrientationChange } from "./config/orientation";
import { ThemeProvider } from '@/app/components/providers/ThemeProvider';

export default function RootLayout() {
  useEffect(() => {
    lockLandscapeOrientation();
    const cleanup = preventOrientationChange();
    return cleanup;
  }, []);

  return (
    <ThemeProvider>
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />
        <Stack 
          screenOptions={{ 
            headerShown: false,
            animation: 'none',
            gestureEnabled: false,
            contentStyle: styles.stackContent
          }} 
        />
      </View>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  stackContent: {
    backgroundColor: 'transparent',
  },
});
