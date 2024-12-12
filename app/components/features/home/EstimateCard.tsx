import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors } from '@/app/constants/colors';
import { useState, useMemo } from 'react';

interface EstimateCardProps {
  customerName: string;
  address: string;
  date: string;
  status: 'provided' | 'accepted' | 'requested';
  index: number;
}

export function EstimateCard({ customerName, address, date, status: initialStatus, index }: EstimateCardProps) {
  const [status, setStatus] = useState(initialStatus);
  const [isSyncing, setIsSyncing] = useState(false);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);

  const houseImages = {
    1: require('@/assets/images/house-1.jpg'),
    2: require('@/assets/images/house-2.jpg'),
    3: require('@/assets/images/house-3.jpg'),
  };

  const houseImage = useMemo(() => {
    const imageIndex = Math.floor(Math.random() * 3 + 1) as keyof typeof houseImages;
    return houseImages[imageIndex];
  }, []);

  const handleStatusChange = (newStatus: EstimateCardProps['status']) => {
    setStatus(newStatus);
    setShowStatusDropdown(false);
  };

  const handleSync = async () => {
    setIsSyncing(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSyncing(false);
  };

  return (
    <View style={styles.card}>
      <View style={styles.imageContainer}>
        <Image 
          source={houseImage}
          style={styles.houseImage}
          resizeMode="cover"
        />
        <View style={styles.statusOverlay}>
          <View style={[styles.statusBadge, styles[`status_${status}`]]}>
            <Text style={styles.statusText}>{status.replace('_', ' ').toUpperCase()}</Text>
          </View>
        </View>
      </View>
      
      <View style={styles.contentContainer}>
        <View style={styles.header}>
          <Text style={styles.customerName} numberOfLines={1}>{customerName}</Text>
          <TouchableOpacity 
            style={styles.editButton}
            onPress={() => setShowStatusDropdown(!showStatusDropdown)}
          >
            <MaterialIcons name="edit" size={16} color={Colors.primary} />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <View style={styles.infoRow}>
            <MaterialIcons name="location-on" size={18} color={Colors.primary} />
            <Text style={styles.infoText} numberOfLines={2}>{address}</Text>
          </View>
          <View style={styles.infoRow}>
            <MaterialIcons name="event" size={18} color={Colors.primary} />
            <Text style={styles.infoText}>{date}</Text>
          </View>
        </View>

        <TouchableOpacity 
          style={[styles.syncButton, isSyncing && styles.syncButtonDisabled]}
          onPress={handleSync}
          disabled={isSyncing}
        >
          <MaterialIcons 
            name="sync" 
            size={18} 
            color={Colors.white}
            style={[isSyncing && styles.rotating]} 
          />
          <Text style={styles.syncButtonText}>
            {isSyncing ? 'Uploading...' : 'Push Now'}
          </Text>
        </TouchableOpacity>
      </View>

      {showStatusDropdown && (
        <View style={styles.dropdown}>
          {['provided', 'requested', 'accepted'].map((s) => (
            <TouchableOpacity 
              key={s}
              style={[styles.dropdownItem, status === s && styles.dropdownItemActive]}
              onPress={() => handleStatusChange(s as EstimateCardProps['status'])}
            >
              <Text style={[styles.dropdownText, status === s && styles.dropdownTextActive]}>
                {s.replace('_', ' ').charAt(0).toUpperCase() + s.slice(1).replace('_', ' ')}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    width: '32%',
    height: 420,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    marginBottom: 24,
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  imageContainer: {
    width: '100%',
    height: 200,
    position: 'relative',
  },
  houseImage: {
    width: '100%',
    height: '100%',
  },
  statusOverlay: {
    position: 'absolute',
    top: 12,
    right: 12,
  },
  contentContainer: {
    padding: 16,
    flex: 1,
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  customerName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.primary,
    flex: 1,
  },
  statusBadge: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  status_provided: {
    backgroundColor: 'rgba(255, 243, 220, 0.95)',
  },
  status_requested: {
    backgroundColor: 'rgba(220, 232, 255, 0.95)',
  },
  status_accepted: {
    backgroundColor: 'rgba(220, 255, 231, 0.95)',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700',
    textAlign: 'center',
    color: Colors.primary,
  },
  editButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#F5F5F5',
  },
  content: {
    gap: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  infoText: {
    fontSize: 14,
    color: '#444',
    flex: 1,
    lineHeight: 20,
  },
  syncButton: {
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 12,
    gap: 8,
    marginTop: 16,
  },
  syncButtonDisabled: {
    opacity: 0.8,
  },
  syncButtonText: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: '600',
  },
  rotating: {
    transform: [{ rotate: '45deg' }],
  },
  dropdown: {
    position: 'absolute',
    top: 80,
    right: 16,
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 6,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
    zIndex: 1000,
    width: 140,
  },
  dropdownItem: {
    padding: 10,
    borderRadius: 8,
  },
  dropdownItemActive: {
    backgroundColor: Colors.primary + '15',
  },
  dropdownText: {
    fontSize: 13,
    color: '#444',
  },
  dropdownTextActive: {
    color: Colors.primary,
    fontWeight: '600',
  },
});