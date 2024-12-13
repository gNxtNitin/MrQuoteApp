import { View, Text, StyleSheet, Image, Pressable } from 'react-native';
import { Colors } from '@/app/constants/colors';
import { MaterialIcons } from '@expo/vector-icons';
import { Estimate } from '@/app/types/estimate';
import { getHouseImage } from '@/app/utils/houseImages';

interface EstimateDetailsProps {
  estimate: Estimate;
}

export function EstimateDetails({ estimate }: EstimateDetailsProps) {
  const houseImage = getHouseImage(estimate.id);

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Image 
          source={houseImage}
          style={styles.coverImage}
          resizeMode="cover"
        />
        
        <View style={styles.contentContainer}>
          <Text style={styles.estimateName}>{estimate.customerName}'s Estimate</Text>
          
          <View style={styles.buttonGrid}>
            <Pressable style={[styles.button, styles.primaryButton]}>
              <MaterialIcons name="edit" size={14} color={Colors.white} />
              <Text style={styles.buttonText}>Edit</Text>
            </Pressable>

            <Pressable style={[styles.button, styles.primaryButton]}>
              <MaterialIcons name="visibility" size={14} color={Colors.white} />
              <Text style={styles.buttonText}>View Estimate</Text>
            </Pressable>

            <Pressable style={[styles.button, styles.primaryButton]}>
              <MaterialIcons name="content-copy" size={14} color={Colors.white} />
              <Text style={styles.buttonText}>Duplicate</Text>
            </Pressable>

            <Pressable style={[styles.button, styles.deleteButton]}>
              <MaterialIcons name="delete" size={14} color={Colors.white} />
              <Text style={styles.buttonText}>Delete</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  card: {
    backgroundColor: Colors.white,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
    minWidth: '100%',
    borderRadius: 16,
  },
  coverImage: {
    width: '100%',
    height: 450,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    overflow: 'hidden'
  },
  contentContainer: {
    padding: 32,
  },
  estimateName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: Colors.primary,
    marginBottom: 40,
  },
  buttonGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
  },
  button: {
    flex: 1,
    minWidth: '20%',
    paddingVertical: 10,
    paddingHorizontal: 6,
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  primaryButton: {
    backgroundColor: Colors.primary,
  },
  deleteButton: {
    backgroundColor: '#DC2626',
  },
  buttonText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.white,
  },
});