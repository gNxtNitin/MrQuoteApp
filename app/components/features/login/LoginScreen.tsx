import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, SafeAreaView, Image, Keyboard, ActivityIndicator } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '@/app/constants/colors';
import { useRouter } from 'expo-router';
import { useAuth } from '@/app/hooks/useAuth';
import NetInfo from '@react-native-community/netinfo';

interface LoginScreenProps {
  onLogin: () => void;
  isDarkMode: boolean;
}

interface ValidationErrors {
  username?: string;
  password?: string;
}

export function LoginScreen({ onLogin, isDarkMode }: LoginScreenProps) {
  const router = useRouter();
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState({ username: false, password: false });
  const [isOnline, setIsOnline] = useState(false);
  const [isCheckingNetwork, setIsCheckingNetwork] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    checkNetworkStatus();

    const intervalId = setInterval(checkNetworkStatus, 3000);

    const unsubscribe = NetInfo.addEventListener(state => {
      setIsOnline(!!state.isConnected);
    });

    return () => {
      clearInterval(intervalId);
      unsubscribe();
    };
  }, []);

  const checkNetworkStatus = async () => {
    try {
      setIsCheckingNetwork(true);
      const state = await NetInfo.fetch();
      setIsOnline(!!state.isConnected);
    } catch (error) {
      console.error('Error checking network status:', error);
      setIsOnline(false);
    } finally {
      setIsCheckingNetwork(false);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};
    
    if (!username.trim()) {
      newErrors.username = 'Username is required';
    } else if (username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    Keyboard.dismiss();
    if (validateForm()) {
      try {
        setIsLoading(true);
        const response = await login(username, password);
        
        if (response.success) {
          if (!response.hasPin) {
            // User needs to set up PIN
            router.replace('/setpin');
          } else {
            // User already has PIN, go to PIN screen
            router.replace('/pin');
          }
        } else {
          setErrors({
            username: response.message,
            password: response.message
          });
        }
      } catch (error) {
        setErrors({
          username: 'Login failed. Please try again.',
          password: 'Login failed. Please try again.'
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleBlur = (field: 'username' | 'password') => {
    setTouched(prev => ({ ...prev, [field]: true }));
    validateForm();
  };

  return (
    <LinearGradient
      colors={[Colors.primary, Colors.gradientSecondary]}
      style={styles.safeArea}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <View style={styles.imageColumn}>
                <Image 
                  source={require('@/assets/images/login-home-image.png')}
                  style={styles.loginImage}
                  resizeMode="cover"
                />
              </View>
              
              <View style={styles.formColumn}>
                <Image
                  source={require('@/assets/images/mr-quote-login.png')}
                  style={styles.loginLogo}
                  resizeMode="contain"
                />

                <Text style={styles.connectionStatus}>
                  {isCheckingNetwork ? (
                    '🔄 Checking connection...'
                  ) : isOnline ? (
                    '🟢 Online Mode'
                  ) : (
                    '🔴 Offline Mode'
                  )}
                </Text>

                <View style={styles.form}>
                  <View>
                    <Text style={styles.inputLabel}>Username</Text>
                    <View style={[
                      styles.inputContainer,
                      touched.username && errors.username && styles.inputError
                    ]}>
                      <MaterialIcons name="person" size={20} color="#888" />
                      <TextInput
                        style={styles.input}
                        placeholder="Enter your username"
                        placeholderTextColor="#888"
                        value={username}
                        onChangeText={setUsername}
                        onBlur={() => handleBlur('username')}
                        autoCapitalize="none"
                      />
                    </View>
                    {touched.username && errors.username && (
                      <Text style={styles.errorText}>{errors.username}</Text>
                    )}
                  </View>

                  <View>
                    <Text style={styles.inputLabel}>Password</Text>
                    <View style={[
                      styles.inputContainer,
                      touched.password && errors.password && styles.inputError
                    ]}>
                      <MaterialIcons name="lock" size={20} color="#888" />
                      <TextInput
                        style={styles.input}
                        placeholder="Enter your password"
                        placeholderTextColor="#888"
                        secureTextEntry={!showPassword}
                        value={password}
                        onChangeText={setPassword}
                        onBlur={() => handleBlur('password')}
                      />
                      <Pressable 
                        onPress={() => setShowPassword(!showPassword)}
                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                      >
                        <MaterialIcons
                          name={showPassword ? 'visibility' : 'visibility-off'}
                          size={20}
                          color="#888"
                        />
                      </Pressable>
                    </View>
                    {touched.password && errors.password && (
                      <Text style={styles.errorText}>{errors.password}</Text>
                    )}
                  </View>

                  <Pressable
                    style={[
                      styles.loginButton,
                      (!username || !password) && styles.loginButtonDisabled
                    ]}
                    onPress={handleLogin}
                    disabled={!username || !password || isLoading}
                  >
                    {isLoading ? (
                      <ActivityIndicator color={Colors.white} size="small" />
                    ) : (
                      <Text style={styles.loginButtonText}>Login</Text>
                    )}
                  </Pressable>
                </View>
              </View>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContainer: {
    width: '90%',
    maxWidth: 1000,
    backgroundColor: Colors.white,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  modalContent: {
    flexDirection: 'row',
    height: 500,
  },
  imageColumn: {
    width: '50%',
    backgroundColor: Colors.gradientSecondary,
  },
  loginImage: {
    width: '100%',
    height: '100%',
  },
  formColumn: {
    width: '50%',
    padding: 40,
    backgroundColor: Colors.gradientSecondary,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
    color: Colors.white,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 40,
    color: Colors.white,
    textAlign: 'center',
  },
  form: {
    width: '100%',
    gap: 16,
    marginTop: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 8,
    paddingHorizontal: 16,
    height: 48,
  },
  input: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: Colors.black,
  },
  inputLabel: {
    color: Colors.white,
    fontSize: 14,
    marginBottom: 8,
    fontWeight: 'bold',
  },
  loginButton: {
    backgroundColor: Colors.primary,
    height: 48,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
    flexDirection: 'row',
    paddingHorizontal: 24,
  },
  loginButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  loginLogo: {
    width: 300,
    height: 100,
    alignSelf: 'center',
    marginBottom: 20,
  },
  inputError: {
    borderWidth: 1,
    borderColor: Colors.error,
  },
  errorText: {
    color: Colors.error,
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
  loginButtonDisabled: {
    opacity: 0.6,
  },
  connectionStatus: {
    fontSize: 14,
    color: Colors.white,
    textAlign: 'center',
    marginBottom: 16,
    opacity: 0.8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});