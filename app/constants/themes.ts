import { Colors } from './colors';

export const lightTheme = {
  background: Colors.white,
  textPrimary: Colors.primary,
  textSecondary: Colors.black,
  primary: Colors.primary,
  secondary: Colors.gradientSecondary,
  card: Colors.white,
  border: '#E5E5E5',
  error: Colors.error,
};

export const darkTheme = {
  background: '#121212', // Darker background for better contrast
  textPrimary: Colors.white,
  textSecondary: Colors.white,
  primary: Colors.primary,
  secondary: Colors.white, // Material Design dark theme secondary color
  card: '#1E1E1E', // Slightly lighter than background for depth
  border: '#333333', // Subtle border color
  error: '#CF6679', // Material Design dark theme error color
};

export type Theme = typeof lightTheme; 