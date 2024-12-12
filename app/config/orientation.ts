import { Platform } from 'react-native';
import * as ScreenOrientation from 'expo-screen-orientation';

export const lockLandscapeOrientation = async () => {
  try {
    // First unlock to ensure clean state
    await ScreenOrientation.unlockAsync();
    // Then lock to LANDSCAPE_RIGHT (this is more reliable than just LANDSCAPE)
    await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE_RIGHT);
  } catch (error) {
    console.warn('Failed to lock orientation:', error);
  }
};

// Add this function to prevent orientation changes
export function preventOrientationChange() {
    const subscription = ScreenOrientation.addOrientationChangeListener(({ orientationInfo }) => {
      if (orientationInfo.orientation !== ScreenOrientation.Orientation.LANDSCAPE_LEFT &&
          orientationInfo.orientation !== ScreenOrientation.Orientation.LANDSCAPE_RIGHT) {
        ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
      }
    });

    // Return a cleanup function to remove the listener
    return () => {
        ScreenOrientation.removeOrientationChangeListener(subscription);
    };
}
  