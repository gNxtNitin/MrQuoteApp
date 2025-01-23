import { Pressable, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors } from '@/app/constants/colors';
import { useTheme } from '@/app/components/providers/ThemeProvider';

interface ActionButtonProps {
  icon: keyof typeof MaterialIcons.glyphMap;
  label: string;
  onPress?: () => void;
  variant?: 'primary' | 'delete';
}

export function ActionButton({ icon, label, onPress, variant = 'primary' }: ActionButtonProps) {
  const theme = useTheme();
  
  return (
    <Pressable 
      style={[
        styles.button, 
        variant === 'delete' ? styles.deleteButton : { backgroundColor: theme.primary }
      ]}
      onPress={onPress}
    >
      <MaterialIcons name={icon} size={18} color={Colors.white} />
      <Text style={[styles.buttonText, { color: Colors.white }]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    flex: 1,
    minWidth: '20%',
    paddingVertical: 10,
    paddingHorizontal: 6,
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  primaryButton: {
    backgroundColor: Colors.primary,
  },
  deleteButton: {
    backgroundColor: '#DC2626',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.white,
  },
}); 