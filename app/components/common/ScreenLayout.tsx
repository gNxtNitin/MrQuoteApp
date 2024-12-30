import { View, StyleSheet } from 'react-native';
import { Colors } from '@/app/constants/colors';
import { Header } from '../features/home/Header';
import { useTheme } from '../providers/ThemeProvider';

interface ScreenLayoutProps {
  children: React.ReactNode;
  subHeader?: React.ReactNode;
}

export function ScreenLayout({ children, subHeader }: ScreenLayoutProps) {
  const theme = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.headerSection, { 
        backgroundColor: theme.background,
        borderBottomColor: theme.border,
        zIndex: 9999,
      }]}>
        <Header />
        {subHeader}
      </View>
      <View style={[styles.content, { 
        backgroundColor: theme.background,
        zIndex: 1
      }]}>
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  headerSection: {
    borderBottomWidth: 1,
    position: 'relative',
  },
  content: {
    flex: 1,
    position: 'relative',
  },
}); 