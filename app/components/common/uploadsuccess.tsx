import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors } from '@/app/constants/colors';

interface UploadSuccessProps {
  selectedImage: string | null;
}

export const UploadSuccess = ({ selectedImage }: UploadSuccessProps) => {
    if (!selectedImage) return null;
    
  return (
    <View style={styles.container}>
        <Image source={{ uri: selectedImage }} style={styles.image} resizeMode="cover" />
      <Text style={styles.successText}>Uploaded Successfully</Text>
      <MaterialIcons name="check-circle" size={40} color={Colors.green} />
      <TouchableOpacity>
      <MaterialIcons name="delete" size={40} color={Colors.black} />

      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height:100,
    gap:20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e7f9e7',
    padding: 16,
    borderRadius: 10,
    marginTop: 10,
    borderWidth: 1,
    borderColor: Colors.lightGreen,
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 50,
    borderWidth:2,
    borderColor:Colors.white
  },
  successText: {
    fontSize: 16,
    color: Colors.black,
    marginLeft: 10,
  },
});
