import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { useAuth } from '@/app/hooks/useAuth';
import { useRouter } from 'expo-router';
import { Colors } from '@/app/constants/colors';
import { LinearGradient } from 'expo-linear-gradient';

export function SetPinScreen() {
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [step, setStep] = useState<'enter' | 'confirm'>('enter');
  const { setupPin, user } = useAuth();
  const router = useRouter();

  const handlePinInput = async (digit: string) => {
    if (step === 'enter') {
      const newPin = pin + digit;
      if (newPin.length === 4) {
        setPin(newPin);
        setStep('confirm');
      } else {
        setPin(newPin);
      }
    } else {
      const newConfirmPin = confirmPin + digit;
      if (newConfirmPin.length === 4) {
        if (newConfirmPin === pin && user?.id) {
          try {
            const success = await setupPin(user.id, parseInt(newConfirmPin));
            if (success) {
              router.replace('/home');
            } else {
              Alert.alert('Error', 'Failed to set PIN. Please try again.');
              resetPins();
            }
          } catch (error) {
            Alert.alert('Error', 'Failed to set PIN. Please try again.');
            resetPins();
          }
        } else {
          Alert.alert('Error', 'PINs do not match. Please try again.');
          resetPins();
        }
      } else {
        setConfirmPin(newConfirmPin);
      }
    }
  };

  const resetPins = () => {
    setPin('');
    setConfirmPin('');
    setStep('enter');
  };

  const handleDelete = () => {
    if (step === 'enter') {
      setPin(prev => prev.slice(0, -1));
    } else {
      setConfirmPin(prev => prev.slice(0, -1));
    }
  };

  const renderPinDots = () => {
    const currentPin = step === 'enter' ? pin : confirmPin;
    return (
      <View style={styles.dotsContainer}>
        {[...Array(4)].map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              index < currentPin.length ? styles.dotFilled : styles.dotEmpty
            ]}
          />
        ))}
      </View>
    );
  };

  const renderNumpad = () => {
    const numbers = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', 'del'];
    return (
      <View style={styles.numpad}>
        {numbers.map((num, index) => (
          <View key={index} style={styles.numpadButton}>
            {num === 'del' ? (
              <Text style={styles.deleteButton} onPress={handleDelete}>
                Delete
              </Text>
            ) : num ? (
              <Text
                style={styles.numpadText}
                onPress={() => handlePinInput(num)}
              >
                {num}
              </Text>
            ) : (
              <View />
            )}
          </View>
        ))}
      </View>
    );
  };

  return (
    <LinearGradient
      colors={[Colors.primary, Colors.gradientSecondary]}
      style={styles.container}
    >
      <View style={styles.content}>
        <Text style={styles.title}>
          {step === 'enter' ? 'Enter New PIN' : 'Confirm PIN'}
        </Text>
        <Text style={styles.subtitle}>
          {step === 'enter' 
            ? 'Please enter a 4-digit PIN'
            : 'Please confirm your PIN'
          }
        </Text>
        {renderPinDots()}
        {renderNumpad()}
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    width: '100%',
    maxWidth: 300,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.white,
    marginBottom: 30,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.white,
    marginBottom: 20,
    textAlign: 'center',
  },
  dotsContainer: {
    flexDirection: 'row',
    marginBottom: 30,
  },
  dot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginHorizontal: 10,
  },
  dotEmpty: {
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  dotFilled: {
    backgroundColor: Colors.white,
  },
  numpad: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    width: '100%',
  },
  numpadButton: {
    width: '33.33%',
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  numpadText: {
    fontSize: 28,
    color: Colors.white,
    padding: 15,
  },
  deleteButton: {
    fontSize: 16,
    color: Colors.white,
    padding: 15,
  },
}); 