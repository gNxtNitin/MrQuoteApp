import { Stack } from "expo-router";
import { useEffect } from "react";
import { StatusBar, StyleSheet, View } from 'react-native';
import { ThemeProvider } from '@/app/components/providers/ThemeProvider';
import { Sidebar } from '@/app/components/features/sidebar/Sidebar';
import { useSidebarStore } from '@/app/stores/sidebarStore';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function RootLayout() {
  const { isOpen, close } = useSidebarStore();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
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
          <Sidebar isOpen={isOpen} onClose={close} />
        </View>
      </ThemeProvider>
    </GestureHandlerRootView>
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
