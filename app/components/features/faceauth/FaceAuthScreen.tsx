import { Colors } from "@/app/constants/colors";
import { LinearGradient } from "expo-linear-gradient";
import { Image } from "expo-image";
import { View, Text, StyleSheet, SafeAreaView, Pressable } from "react-native";
import { useRouter } from "expo-router";

interface FaceAuthScreenProps {
  onFaceAuth: () => void;
  isDarkMode: boolean;
}

export function FaceAuthScreen({
  onFaceAuth,
  isDarkMode,
}: FaceAuthScreenProps) {
  const router = useRouter();

  return (
    <LinearGradient
      colors={[Colors.primary, Colors.gradientSecondary]}
      style={styles.safeArea}
    >
      <SafeAreaView style={styles.safeAreaView}>
        <View style={styles.container}>
          <View style={styles.imageView}>
            <Image
              source={require("@/assets/images/faceauth-image.jpg")}
              style={styles.image}
            />
            <Text style={styles.instruction}>
              Slowly move your head in a circular motion to complete the circle.
              Follow the on-screen guide for accurate positioning and progress.
            </Text>
          </View>
          <View style={styles.pinGradientWrapper}>
            <LinearGradient
              colors={[Colors.primary, Colors.gradientSecondary]}
              style={styles.pinGradient}
            >
              <View style={styles.faceauth}>
                <Image
                  source={require("@/assets/images/faceauth.gif")}
                  style={styles.gif}
                />
                <Pressable
                  style={styles.skipBtn}
                  onPress={() => router.replace("/home")}
                >
                  <Text style={styles.skip}>SKIP</Text>
                </Pressable>
                <Pressable
                  style={styles.authenticateBtn}
                  onPress={() => router.replace("/home")}
                >
                  <Text style={styles.authenticate}>AUTHENTICATE</Text>
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
    width: "90%",
    maxWidth: 1000,
    height: 500,
    flexDirection: "row",
    borderRadius: 12,
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
  pinGradientWrapper: {
    flex: 1,
    borderTopRightRadius: 12,
    borderBottomEndRadius: 12,
    overflow: "hidden",
  },
  pinGradient: {
    height: "100%",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  faceauth: {
    width: "80%",
    gap: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  gif: {
    height: 235,
    width: 235,
    marginBottom: 25,
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
    width: "100%",
  },
  authenticate: {
    color: Colors.white,
    fontWeight: "600",
    fontSize: 20,
    lineHeight: 30,
  },
  authenticateBtn: {
    backgroundColor: Colors.primary,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 12,
    width: "100%",
  },
});
