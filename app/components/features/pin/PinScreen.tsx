import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, Pressable } from 'react-native';
import { useAuth } from '@/app/hooks/useAuth';
import { useRouter } from 'expo-router';
import { Colors } from '@/app/constants/colors';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserDetail } from '@/app/database/models/UserDetail';

export function PinScreen() {
  const [pin, setPin] = useState('');
  const [username, setUsername] = useState('');
  const { loginWithPin, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const userId = await AsyncStorage.getItem('@user_id');
      if (userId) {
        const userDetails = await UserDetail.getById(parseInt(userId));
        if (userDetails?.username) {
          setUsername(userDetails.username);
        } else {
          router.replace('/login');
        }
      } else {
        router.replace('/login');
      }
    } catch (error) {
      console.error('Error loading user data:', error);
      router.replace('/login');
    }
  };

  const handlePinInput = async (digit: string) => {
    const newPin = pin + digit;
    setPin(newPin);

    if (newPin.length === 4) {
      try {
        const response = await loginWithPin(parseInt(newPin));
        if (response.success) {
          router.replace('/home');
        } else {
          Alert.alert('Error', response.message);
          setPin('');
        }
      } catch (error) {
        Alert.alert('Error', 'Failed to verify PIN');
        setPin('');
      }
    }
  };

  const handleDelete = () => {
    setPin(prev => prev.slice(0, -1));
  };

  const handleResetPin = () => {
    Alert.alert(
      'Reset PIN',
      'This will log you out and you will need to login again with your username and password. Continue?',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: async () => {
            await logout(true);
            router.replace('/login');
          }
        }
      ]
    );
  };

  const renderPinDots = () => {
    return (
      <View style={styles.dotsContainer}>
        {[...Array(4)].map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              index < pin.length ? styles.dotFilled : styles.dotEmpty
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
        <Text style={styles.welcomeText}>Welcome back</Text>
        <Text style={styles.username}>{username}</Text>
        <Text style={styles.title}>Enter PIN</Text>
        {renderPinDots()}
        {renderNumpad()}
        <Pressable onPress={handleResetPin}>
          <Text style={styles.resetText}>Reset PIN</Text>
        </Pressable>
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
  resetText: {
    color: Colors.white,
    fontSize: 16,
    marginTop: 20,
    textDecorationLine: 'underline',
    opacity: 0.8
  },
  welcomeText: {
    fontSize: 24,
    color: Colors.white,
    marginBottom: 8,
    textAlign: 'center',
  },
  username: {
    fontSize: 18,
    color: Colors.white,
    marginBottom: 32,
    opacity: 0.9,
    textAlign: 'center',
  },
});
