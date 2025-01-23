import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '@/app/constants/colors';
import { SearchBar } from './SearchBar';
import { ActionButtons } from './ActionButtons';
import { useTheme } from '@/app/components/providers/ThemeProvider';

interface SubHeaderProps {
  onSync: () => void;
  onCreate: () => void;
}

export function SubHeader({ onSync, onCreate }: SubHeaderProps) {
  const theme = useTheme();
  
  return (
    <View style={[styles.container, { 
      backgroundColor: theme.background,
      borderBottomColor: theme.border,
      borderBottomWidth: 1,
    }]}>
      <View style={styles.content}>
        <View style={styles.contentWrapper}>
          <Text style={[styles.title, { color: theme.textPrimary }]}>Estimate</Text>
          <View style={styles.rightSection}>
            <View style={styles.searchContainer}>
              <SearchBar />
            </View>
            <View style={styles.buttonContainer}>
              <ActionButtons onSync={onSync} onCreate={onCreate} />
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    width: '100%',
  },
  content: {
    paddingVertical: 16,
    paddingLeft: 24,
  },
  contentWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  rightSection: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 16,
  },
  searchContainer: {
    flex: 1,
    maxWidth: 380,
    justifyContent: 'center',
  },
  buttonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  divider: {
    height: 1,
    backgroundColor: '#eee',
    marginLeft: 24,
    marginRight: 24,
  },
}); 