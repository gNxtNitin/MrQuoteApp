import { Stack } from "expo-router";
import { useEffect } from "react";
import { lockLandscapeOrientation, preventOrientationChange } from "./config/orientation";

export default function RootLayout() {
  useEffect(() => {
    lockLandscapeOrientation();
    const cleanup = preventOrientationChange();
    return cleanup;
  }, []);

  return (
    <Stack 
      screenOptions={{ 
        headerShown: false,
        animation: 'none',
        gestureEnabled: false
      }} 
    />
  );
}
