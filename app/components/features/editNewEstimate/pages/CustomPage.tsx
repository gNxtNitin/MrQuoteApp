import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '@/app/constants/colors';

interface CustomPageProps {
  title: string;
}

export function CustomPage({ title }: CustomPageProps) {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.placeholder}>Custom page content goes here</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.primary,
    marginBottom: 16,
  },
  placeholder: {
    fontSize: 16,
    color: '#666',
  },
}); 