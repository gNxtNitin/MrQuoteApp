import { View, Image, StyleSheet } from 'react-native';
import { Colors } from '@/app/constants/colors';

export function SplashScreen() {
  return (
    <View style={styles.container}>
      <Image
        source={require('@/assets/images/mr-quote-login.png')}
        style={styles.logo}
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.loginDialogBackground,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: '60%',
    height: 100,
  },
}); 