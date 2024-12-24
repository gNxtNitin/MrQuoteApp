import { View, TextInput, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors } from '@/app/constants/colors';
import { useTheme } from '@/app/components/providers/ThemeProvider';

export function SearchBar() {
  const theme = useTheme();

  return (
    <View style={[
      styles.container, 
      { 
        backgroundColor: theme.background,
        borderColor: theme.primary 
      }
    ]}>
      <MaterialIcons name="search" size={24} color={theme.secondary} />
      <TextInput 
        style={[styles.input, { color: theme.textPrimary }]}
        placeholder="Search"
        placeholderTextColor={theme.secondary}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
    borderRadius: 30,
    paddingHorizontal: 16,
    height: 48,
    width: 300,
    borderWidth: 1,
  },
  input: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
  },
}); 