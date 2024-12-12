import { Stack } from "expo-router";
import { useEffect } from "react";
import { StatusBar } from 'react-native';
import { lockLandscapeOrientation, preventOrientationChange } from "./config/orientation";

export default function RootLayout() {
  useEffect(() => {
    lockLandscapeOrientation();
    const cleanup = preventOrientationChange();
    return cleanup;
  }, []);

  return (
    <>
      <StatusBar barStyle="light-content" />
      <Stack 
        screenOptions={{ 
          headerShown: false,
          animation: 'none',
          gestureEnabled: false
        }} 
      />
    </>
  );
}
