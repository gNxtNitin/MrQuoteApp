import { View, Text, Image, StyleSheet, Platform, StatusBar } from 'react-native';
import { Colors } from '@/app/constants/colors';

export function Header() {
  const companyName = "MR. GUTTER";
  const initials = "MG";

  return (
    <View style={styles.header}>
      <View style={styles.content}>
        <View style={styles.leftSection}>
          <Image 
            source={require('@/assets/images/header-logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        <View style={styles.rightSection}>
          <Text style={styles.companyName}>{companyName}</Text>
          <View style={styles.initialsCircle}>
            <Text style={styles.initials}>{initials}</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: Colors.primary,
    paddingTop: Platform.OS === 'ios' ? 50 : StatusBar.currentHeight ?? 10 + 10,
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: 24,
    paddingRight:24,
    paddingBottom: 20
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  logo: {
    width: 140,
    height: 50,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  companyName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.white,
  },
  initialsCircle: {
    width: 60,
    height: 60,
    borderRadius: 35,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  initials: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.primary,
  },
}); 