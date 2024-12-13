import { View, Text, StyleSheet, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors } from '@/app/constants/colors';
import { router } from 'expo-router';
import { Estimate } from '@/app/types/estimate';

type EstimateSubHeaderProps = Estimate;

export function EstimateSubHeader({ 
  customerName, 
  address, 
  phone, 
  email, 
  status, 
  date 
}: EstimateSubHeaderProps) {
  const handleBack = () => router.back();

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.leftSection}>
          <Pressable style={styles.backButton} onPress={handleBack}>
            <MaterialIcons name="arrow-back" size={20} color={Colors.primary} />
            <Text style={styles.backText}>Back</Text>
          </Pressable>
          <View style={styles.infoSection}>
            <View style={styles.customerHeader}>
              <Text style={styles.customerName}>{customerName}</Text>
              <View style={[styles.badge, styles[`status_${status}`]]}>
                <Text style={[styles.badgeText, styles[`statusText_${status}`]]}>
                  {status.toUpperCase()}
                </Text>
              </View>
            </View>
            <View style={styles.detailsContainer}>
              <View style={styles.detailsColumn}>
                <View style={styles.detailsRow}>
                  <MaterialIcons name="location-on" size={14} color={Colors.primary} />
                  <Text style={styles.detailText}>{address}</Text>
                </View>
                <View style={styles.detailsRow}>
                  <MaterialIcons name="phone" size={14} color={Colors.primary} />
                  <Text style={styles.detailText}>{phone}</Text>
                </View>
              </View>
              <View style={styles.detailsColumn}>
                <View style={styles.detailsRow}>
                  <MaterialIcons name="email" size={14} color={Colors.primary} />
                  <Text style={styles.detailText}>{email}</Text>
                </View>
                <View style={styles.detailsRow}>
                  <MaterialIcons name="event" size={14} color={Colors.primary} />
                  <Text style={styles.detailText}>{date}</Text>
                </View>
              </View>
            </View>
          </View>
        </View>
        <View style={styles.rightSection}>
          <View style={styles.actionRows}>
            <View style={styles.iconGroup}>
              <Pressable style={styles.iconButton}>
                <MaterialIcons name="settings" size={18} color={Colors.primary} />
              </Pressable>
              {/* <Pressable style={styles.iconButton}>
                <MaterialIcons name="view-agenda" size={18} color={Colors.primary} />
              </Pressable> */}
            </View>
            <View style={styles.buttonGroup}>
            <Pressable style={[styles.actionButton, styles.primaryButton]}>
                <MaterialIcons name="add" size={16} color={Colors.white} />
                <Text style={[styles.actionButtonText, styles.primaryButtonText]}>New Estimate</Text>
              </Pressable>
              <Pressable style={styles.actionButton}>
                <MaterialIcons name="upload" size={16} color={Colors.primary} />
                <Text style={styles.actionButtonText}>Upload Changes</Text>
              </Pressable>
              <Pressable style={styles.actionButton}>
                <MaterialIcons name="view-agenda" size={16} color={Colors.primary} />
                <Text style={styles.actionButtonText}>Change Layout</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </View>
      <View style={styles.divider} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: Colors.white, width: '100%' },
  content: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', padding: 16, gap: 16 },
  leftSection: { flex: 1, gap: 12 },
  backButton: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  backText: { fontSize: 16, color: Colors.primary, fontWeight: '600' },
  infoSection: { gap: 12 },
  customerHeader: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  customerName: { fontSize: 24, fontWeight: 'bold', color: Colors.primary },
  badge: { backgroundColor: '#E8F5E9', paddingHorizontal: 10, paddingVertical: 3, borderRadius: 12 },
  badgeText: { color: '#2E7D32', fontSize: 13, fontWeight: '600' },
  detailsContainer: { flexDirection: 'row', gap: 32 },
  detailsColumn: { gap: 8 },
  detailsRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  detailText: { fontSize: 14, color: '#444' },
  rightSection: { gap: 12 },
  actionRows: { flexDirection: 'column', gap: 32 },
  iconGroup: { flexDirection: 'row', justifyContent: 'flex-end', gap: 6 },
  buttonGroup: { flexDirection: 'row', gap: 8 },
  actionButton: {
    flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 8,
    borderRadius: 6, gap: 6, borderWidth: 1, borderColor: Colors.primary, backgroundColor: Colors.white
  },
  primaryButton: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  actionButtonText: { fontSize: 14, fontWeight: '600', color: Colors.primary },
  primaryButtonText: { color: Colors.white },
  iconButton: { padding: 6, borderRadius: 6, backgroundColor: '#F5F5F5' },
  divider: { height: 1, backgroundColor: '#eee', marginHorizontal: 16 },
  status_provided: {
    backgroundColor: 'rgba(255, 243, 220, 0.95)',
  },
  status_requested: {
    backgroundColor: 'rgba(229, 231, 255, 0.95)',
  },
  status_accepted: {
    backgroundColor: 'rgba(220, 255, 231, 0.95)',
  },
  status_completed: {
    backgroundColor: 'rgba(187, 247, 208, 0.95)',
  },
  status_revised: {
    backgroundColor: 'rgba(254, 226, 226, 0.95)',
  },
  status_cancelled: {
    backgroundColor: 'rgba(254, 202, 202, 0.95)',
  },
  statusText_provided: {
    color: '#B45309',
  },
  statusText_requested: {
    color: '#1E3A8A',
  },
  statusText_accepted: {
    color: '#166534',
  },
  statusText_completed: {
    color: '#047857',
  },
  statusText_revised: {
    color: '#9A3412',
  },
  statusText_cancelled: {
    color: '#B91C1C',
  },
});