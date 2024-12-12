import { View, TextInput, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors } from '@/app/constants/colors';

export function SearchBar() {
  return (
    <View style={styles.container}>
      <MaterialIcons name="search" size={24} color="#888" />
      <TextInput 
        style={styles.input}
        placeholder="Search"
        placeholderTextColor="#888"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 30,
    paddingHorizontal: 16,
    height: 48,
    width: 380,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  input: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: Colors.black,
  },
}); 