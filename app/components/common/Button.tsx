import { Pressable, Text, StyleSheet, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors } from '@/app/constants/colors';

export type ButtonVariant = 'primary' | 'secondary' | 'delete' | 'outline';
export type ButtonSize = 'small' | 'medium' | 'large';

interface ButtonProps {
  label: string;
  onPress?: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: keyof typeof MaterialIcons.glyphMap;
  disabled?: boolean;
  fullWidth?: boolean;
}

export function Button({ 
  label, 
  onPress, 
  variant = 'primary',
  size = 'medium',
  icon,
  disabled = false,
  fullWidth = false,
}: ButtonProps) {
  return (
    <Pressable 
      style={[
        styles.button,
        styles[variant],
        styles[size],
        fullWidth && styles.fullWidth,
        disabled && styles.disabled,
      ]} 
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={label}
    >
      {icon && (
        <MaterialIcons 
          name={icon} 
          size={size === 'small' ? 16 : 20} 
          color={variant === 'outline' ? Colors.primary : Colors.white} 
        />
      )}
      <Text style={[
        styles.text,
        styles[`${variant}Text`],
        styles[`${size}Text`],
        disabled && styles.disabledText,
      ]}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    gap: 8,
  },
  primary: {
    backgroundColor: Colors.primary,
  },
  secondary: {
    backgroundColor: Colors.gradientSecondary,
  },
  delete: {
    backgroundColor: '#DC2626',
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  small: {
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  medium: {
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  large: {
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  fullWidth: {
    width: '100%',
  },
  disabled: {
    opacity: 0.6,
  },
  text: {
    fontWeight: '600',
  },
  primaryText: {
    color: Colors.white,
  },
  secondaryText: {
    color: Colors.white,
  },
  deleteText: {
    color: Colors.white,
  },
  outlineText: {
    color: Colors.primary,
  },
  smallText: {
    fontSize: 14,
  },
  mediumText: {
    fontSize: 16,
  },
  largeText: {
    fontSize: 18,
  },
  disabledText: {
    opacity: 0.8,
  },
});
