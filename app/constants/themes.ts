import { Colors } from './colors';

export const lightTheme = {
  background: Colors.white,
  text: Colors.black,
  primary: Colors.primary,
  secondary: Colors.gradientSecondary,
  card: Colors.white,
  border: '#E5E5E5',
  error: Colors.error,
};

export const darkTheme = {
  background: '#1a1a1a',
  text: Colors.white,
  primary: '#2176FF',
  secondary: '#164B99',
  card: '#2D2D2D',
  border: '#404040',
  error: '#FF6B6B',
};

export type Theme = typeof lightTheme; 