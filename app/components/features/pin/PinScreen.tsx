import {
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TextInput,
  Pressable,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Colors } from "@/app/constants/colors";
import { useState } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

interface PinScreenProps {
  onPin: () => void;
  isDarkMode: boolean;
}

interface ValidationErrors {
  pin?: string;
  confirmPin?: string;
}

export function PinScreen({ onPin, isDarkMode }: PinScreenProps) {
  const router = useRouter();
  const [touched, setTouched] = useState<{ pin: boolean; confirmPin: boolean }>(
    {
      pin: false,
      confirmPin: false,
    }
  );
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [pin, setPin] = useState<string>("");
  const [confirmPin, setConfirmPin] = useState<string>("");

  const handleBlur = (field: "pin" | "confirmPin") => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    validatePins();
  };

  const validatePins = () => {
    const newErrors: ValidationErrors = {};

    if (pin.trim() === "") {
      newErrors.pin = "PIN cannot be empty";
    }
    if (confirmPin.trim() === "") {
      newErrors.confirmPin = "Confirm PIN cannot be empty";
    } else if (pin.length !== 4 || isNaN(Number(pin))) {
      newErrors.pin = "PIN must be a 4-digit number";
    }
    if (confirmPin !== pin) {
      newErrors.confirmPin = "PINs do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (validatePins()) {
      try {
        const isAuthenticated = true;
        if (isAuthenticated) {
          router.replace("/faceauth");
        } else {
          setErrors({
            pin: "Invalid PIN",
            confirmPin: "Invalid PIN",
          });
        }
      } catch (error) {
        setErrors({
          pin: "Login failed. Please try again.",
          confirmPin: "Login failed. Please try again.",
        });
      }
    }
  };

  return (
    <LinearGradient
      colors={[Colors.primary, Colors.gradientSecondary]}
      style={styles.safeArea}
    >
      <SafeAreaView style={styles.safeAreaView}>
        <View style={styles.container}>
          <View style={styles.imageView}>
            <Image
              source={require("@/assets/images/setpin-image.png")}
              resizeMode="cover"
              style={styles.image}
            />
            <Text style={styles.instruction}>
              Set your 4-digit PIN to secure your account. Use numbers only.
              Enter carefully and confirm for security. Press backspace to
              correct.
            </Text>
          </View>
          <View style={styles.pinGradientWrapper}>
            <LinearGradient
              colors={[Colors.primary, Colors.gradientSecondary]}
              style={styles.pinGradient}
            >
              <View style={styles.form}>
                <View>
                  <Text style={styles.inputLabel}>Pin</Text>
                  <View
                    style={[
                      styles.inputContainer,
                      touched.pin && errors.pin && styles.inputError,
                    ]}
                  >
                    <View style={styles.numBox}>
                      <MaterialIcons name="123" size={26} color="#979797" />
                    </View>
                    <TextInput
                      style={styles.input}
                      placeholder="Enter your 4 digit pin"
                      placeholderTextColor={Colors.placeholderTextColor}
                      value={pin}
                      onChangeText={setPin}
                      onBlur={() => handleBlur("pin")}
                      autoCapitalize="none"
                      keyboardType="numeric"
                      secureTextEntry
                      maxLength={4}
                    />
                  </View>
                  {touched.pin && errors.pin && (
                    <Text style={styles.errorText}>{errors.pin}</Text>
                  )}
                </View>
                <View>
                  <Text style={styles.inputLabel}>Confirm Pin</Text>
                  <View
                    style={[
                      styles.inputContainer,
                      touched.confirmPin &&
                        errors.confirmPin &&
                        styles.inputError,
                    ]}
                  >
                    <View style={styles.numBox}>
                      <MaterialIcons name="123" size={26} color="#979797" />
                    </View>
                    <TextInput
                      style={styles.input}
                      placeholder="Re-enter your 4 digit pin"
                      placeholderTextColor={Colors.placeholderTextColor}
                      value={confirmPin}
                      onChangeText={setConfirmPin}
                      onBlur={() => handleBlur("confirmPin")}
                      secureTextEntry
                      keyboardType="numeric"
                      maxLength={4}
                    />
                  </View>
                  {touched.confirmPin && errors.confirmPin && (
                    <Text style={styles.errorText}>{errors.confirmPin}</Text>
                  )}
                </View>
                <Pressable
                  style={styles.skipBtn}
                  onPress={() => router.replace("/faceauth")}
                >
                  <Text style={styles.skip}>SKIP</Text>
                </Pressable>
                <Pressable style={styles.submitBtn} onPress={handleSubmit}>
                  <Text style={styles.submit}>SUBMIT</Text>
                </Pressable>
              </View>
            </LinearGradient>
          </View>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    justifyContent: "center",
  },
  safeAreaView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    backgroundColor: Colors.white,
    width: "85%",
    height: "60%",
    flexDirection: "row",
    borderRadius: 12,
  },
  pinGradientWrapper: {
    flex: 1,
    borderTopRightRadius: 12,
    borderBottomEndRadius:12,
    overflow: "hidden",
  },
  pinGradient: {
    height: "100%",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  imageView: {
    height: "100%",
    width: "50%",
    alignItems: "center",
    gap: 15,
  },
  image: {
    height: "70%",
    width: "70%",
  },
  instruction: {
    fontWeight: "500",
    fontSize: 18,
    color: Colors.black,
    width: "70%",
  },
  form: {
    width: "80%",
    gap: 16,
    marginTop: 20,
  },
  inputLabel: {
    color: Colors.white,
    fontSize: 14,
    marginBottom: 8,
    fontWeight: "bold",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.white,
    borderRadius: 12,
    paddingHorizontal: 20,
    height: 48,
    paddingVertical: 5,
  },
  input: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: Colors.black,
  },
  errorText: {
    color: Colors.error,
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
  inputError: {
    borderWidth: 1,
    borderColor: Colors.error,
  },
  numBox: {
    borderColor: "#979797",
    borderWidth: 0.5,
    height: 20,
  },
  skip: {
    color: Colors.white,
    fontWeight: "600",
    fontSize: 20,
    lineHeight: 30,
  },
  skipBtn: {
    borderWidth: 2,
    borderColor: Colors.primary,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 12,
  },
  submit: {
    color: Colors.white,
    fontWeight: "600",
    fontSize: 20,
    lineHeight: 30,
  },
  submitBtn: {
    backgroundColor: Colors.primary,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 12,
  },
});
