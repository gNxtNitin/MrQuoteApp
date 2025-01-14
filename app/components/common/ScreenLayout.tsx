import { View, StyleSheet, Pressable } from 'react-native';
import { Colors } from '@/app/constants/colors';
import { Header } from '../features/home/Header';
import { useTheme } from '../providers/ThemeProvider';
import { useHeaderStore } from '@/app/stores/headerStore';

interface ScreenLayoutProps {
  children: React.ReactNode;
  subHeader?: React.ReactNode;
}

export function ScreenLayout({ children, subHeader }: ScreenLayoutProps) {
  const theme = useTheme();
  const { showSwitcher, setShowSwitcher } = useHeaderStore();

  const handleOverlayPress = () => {
    if (showSwitcher) {
      setShowSwitcher(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {showSwitcher && (
        <Pressable 
          style={styles.overlay}
          onPress={handleOverlayPress}
        />
      )}
      <View style={[styles.headerSection, { 
        backgroundColor: theme.background,
        borderBottomColor: theme.border,
        zIndex: showSwitcher ? 10000 : 9999,
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
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'transparent',
    zIndex: 9998,
  },
}); 